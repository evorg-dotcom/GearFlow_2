/*
  # Fix Reply Votes and Post Replies Functionality

  1. New Tables
    - `reply_votes` - Tracks user votes on post replies
  
  2. Views
    - `post_replies_with_profiles` - Joins replies with user profile information
  
  3. Functions and Triggers
    - `update_reply_vote()` - Updates vote counts when votes are added/changed/removed
    - `update_post_replies_updated_at()` - Updates timestamp when replies are modified
  
  4. Security
    - Enable RLS on reply_votes
    - Add policies for proper access control
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

-- Create RLS policies for reply_votes using DO block to check if they exist
DO $$
BEGIN
  -- Check if policy exists before creating
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
END
$$;

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

-- Create triggers for reply_votes
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

-- Create function to update post_replies updated_at timestamp
CREATE OR REPLACE FUNCTION update_post_replies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for post_replies updated_at
DROP TRIGGER IF EXISTS update_post_replies_updated_at ON post_replies;
CREATE TRIGGER update_post_replies_updated_at
  BEFORE UPDATE ON post_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_post_replies_updated_at();

-- Grant necessary permissions
GRANT ALL ON TABLE reply_votes TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE reply_votes TO authenticated;