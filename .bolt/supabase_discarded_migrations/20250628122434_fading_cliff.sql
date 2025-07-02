/*
  # Fix Community Votes and Replies

  1. New Tables
    - Ensure reply_votes table exists for tracking user votes on replies
  
  2. Views
    - Create post_replies_with_profiles view for easy access to reply data with user info
  
  3. Functions and Triggers
    - Add update_reply_vote function to maintain vote counts
    - Add triggers for vote count maintenance
    - Add updated_at timestamp maintenance
  
  4. Security
    - Enable RLS on all tables
    - Add appropriate policies for user access control
*/

-- Create reply_votes table if it doesn't exist
CREATE TABLE IF NOT EXISTS reply_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reply_id uuid NOT NULL REFERENCES post_replies(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_reply_vote UNIQUE (user_id, reply_id)
);

-- Enable RLS on reply_votes
ALTER TABLE reply_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reply_votes (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reply_votes' AND policyname = 'Users can view their own reply votes'
  ) THEN
    CREATE POLICY "Users can view their own reply votes" 
      ON reply_votes 
      FOR SELECT 
      TO authenticated 
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reply_votes' AND policyname = 'Users can insert their own reply votes'
  ) THEN
    CREATE POLICY "Users can insert their own reply votes" 
      ON reply_votes 
      FOR INSERT 
      TO authenticated 
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reply_votes' AND policyname = 'Users can update their own reply votes'
  ) THEN
    CREATE POLICY "Users can update their own reply votes" 
      ON reply_votes 
      FOR UPDATE 
      TO authenticated 
      USING (auth.uid() = user_id) 
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reply_votes' AND policyname = 'Users can delete their own reply votes'
  ) THEN
    CREATE POLICY "Users can delete their own reply votes" 
      ON reply_votes 
      FOR DELETE 
      TO authenticated 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create post_replies_with_profiles view if it doesn't exist
CREATE OR REPLACE VIEW post_replies_with_profiles AS
SELECT 
  pr.id,
  pr.post_id,
  pr.user_id,
  pr.content,
  pr.upvotes,
  pr.downvotes,
  pr.created_at,
  pr.updated_at,
  p.display_name,
  p.avatar_url
FROM post_replies pr
LEFT JOIN profiles p ON pr.user_id = p.user_id;

-- Grant access to the view
GRANT SELECT ON post_replies_with_profiles TO authenticated;

-- Create function to update reply votes
CREATE OR REPLACE FUNCTION update_reply_vote()
RETURNS TRIGGER AS $$
DECLARE
  reply_record RECORD;
  old_vote_type TEXT;
BEGIN
  -- Get the reply record
  SELECT * INTO reply_record FROM post_replies WHERE id = NEW.reply_id;
  
  -- If this is an update, get the old vote type
  IF TG_OP = 'UPDATE' THEN
    old_vote_type := OLD.vote_type;
  END IF;
  
  -- Update the vote counts based on the operation
  IF TG_OP = 'INSERT' THEN
    -- New vote
    IF NEW.vote_type = 'up' THEN
      UPDATE post_replies SET upvotes = upvotes + 1 WHERE id = NEW.reply_id;
    ELSIF NEW.vote_type = 'down' THEN
      UPDATE post_replies SET downvotes = downvotes + 1 WHERE id = NEW.reply_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND NEW.vote_type <> old_vote_type THEN
    -- Changed vote type
    IF old_vote_type = 'up' AND NEW.vote_type = 'down' THEN
      UPDATE post_replies SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.reply_id;
    ELSIF old_vote_type = 'down' AND NEW.vote_type = 'up' THEN
      UPDATE post_replies SET downvotes = downvotes - 1, upvotes = upvotes + 1 WHERE id = NEW.reply_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    -- Removed vote
    IF OLD.vote_type = 'up' THEN
      UPDATE post_replies SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.reply_id;
    ELSIF OLD.vote_type = 'down' THEN
      UPDATE post_replies SET downvotes = GREATEST(0, downvotes - 1) WHERE id = OLD.reply_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for reply_votes (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS reply_vote_insert_trigger ON reply_votes;
CREATE TRIGGER reply_vote_insert_trigger
  AFTER INSERT ON reply_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_reply_vote();

DROP TRIGGER IF EXISTS reply_vote_update_trigger ON reply_votes;
CREATE TRIGGER reply_vote_update_trigger
  AFTER UPDATE ON reply_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_reply_vote();

DROP TRIGGER IF EXISTS reply_vote_delete_trigger ON reply_votes;
CREATE TRIGGER reply_vote_delete_trigger
  AFTER DELETE ON reply_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_reply_vote();

-- Create function to update post_replies updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_post_replies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for post_replies updated_at (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_post_replies_updated_at'
  ) THEN
    CREATE TRIGGER update_post_replies_updated_at
      BEFORE UPDATE ON post_replies
      FOR EACH ROW
      EXECUTE FUNCTION update_post_replies_updated_at();
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- If post_replies table doesn't exist, create it
    CREATE TABLE post_replies (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      content text NOT NULL,
      upvotes integer NOT NULL DEFAULT 0,
      downvotes integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    
    -- Enable RLS
    ALTER TABLE post_replies ENABLE ROW LEVEL SECURITY;
    
    -- Create RLS policies
    CREATE POLICY "Users can view all post replies" 
      ON post_replies 
      FOR SELECT 
      TO authenticated 
      USING (true);
      
    CREATE POLICY "Users can insert their own post replies" 
      ON post_replies 
      FOR INSERT 
      TO authenticated 
      WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Users can update their own post replies" 
      ON post_replies 
      FOR UPDATE 
      TO authenticated 
      USING (auth.uid() = user_id) 
      WITH CHECK (auth.uid() = user_id);
      
    CREATE POLICY "Users can delete their own post replies" 
      ON post_replies 
      FOR DELETE 
      TO authenticated 
      USING (auth.uid() = user_id);
      
    -- Create trigger
    CREATE TRIGGER update_post_replies_updated_at
      BEFORE UPDATE ON post_replies
      FOR EACH ROW
      EXECUTE FUNCTION update_post_replies_updated_at();
  END;
END $$;

-- Grant necessary permissions
GRANT ALL ON TABLE reply_votes TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE reply_votes TO authenticated;