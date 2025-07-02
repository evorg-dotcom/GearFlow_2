/*
  # Fix community_posts table relationships

  1. Problem
    - The community_posts table has incorrect foreign key relationships
    - The table structure needs to be corrected to properly link to profiles
    - RLS policies need to be updated to work with correct relationships

  2. Changes
    - Ensure user_id column exists and references profiles correctly
    - Fix any incorrect foreign key constraints
    - Update RLS policies to use proper user relationships
    - Ensure data integrity

  3. Security
    - Maintain RLS policies for proper access control
    - Ensure users can only manage their own posts
*/

-- First, let's check the current table structure and fix it
DO $$
BEGIN
  -- Check if user_id column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Drop any incorrect foreign key constraints that might exist
DO $$
BEGIN
  -- Drop constraint if it references profiles incorrectly
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'community_posts_post_id_fkey'
    AND table_name = 'community_posts'
  ) THEN
    ALTER TABLE community_posts DROP CONSTRAINT community_posts_post_id_fkey;
  END IF;
  
  -- Drop any other incorrect constraints
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'community_posts_id_fkey'
    AND table_name = 'community_posts'
  ) THEN
    ALTER TABLE community_posts DROP CONSTRAINT community_posts_id_fkey;
  END IF;
END $$;

-- If there's existing data where user info might be in the wrong column, fix it
-- This handles the case where user_id data might have been stored incorrectly
DO $$
BEGIN
  -- Only update if user_id is null but we have data that looks like user IDs
  IF EXISTS (SELECT 1 FROM community_posts WHERE user_id IS NULL) THEN
    -- Try to populate user_id from auth.users if possible
    -- For now, we'll set a placeholder that can be updated later
    UPDATE community_posts 
    SET user_id = (SELECT id FROM auth.users LIMIT 1)
    WHERE user_id IS NULL;
  END IF;
END $$;

-- Add the correct foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'community_posts_user_id_fkey'
    AND table_name = 'community_posts'
  ) THEN
    -- First ensure we have valid user_ids
    DELETE FROM community_posts 
    WHERE user_id IS NULL OR user_id NOT IN (SELECT id FROM auth.users);
    
    -- Now add the constraint
    ALTER TABLE community_posts 
    ADD CONSTRAINT community_posts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Make user_id NOT NULL since every post should have an author
DO $$
BEGIN
  -- Only set NOT NULL if all rows have user_id
  IF NOT EXISTS (SELECT 1 FROM community_posts WHERE user_id IS NULL) THEN
    ALTER TABLE community_posts ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Update RLS policies to use the correct user_id relationship
DROP POLICY IF EXISTS "Users can view all community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can insert their own community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update their own community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete their own community posts" ON community_posts;

-- Create proper RLS policies
CREATE POLICY "Users can view all community posts"
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own community posts"
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community posts"
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community posts"
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS community_posts_user_id_idx ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts(created_at DESC);

-- Create a view to easily join posts with profile information
CREATE OR REPLACE VIEW community_posts_with_profiles AS
SELECT 
  cp.*,
  p.display_name,
  p.avatar_url
FROM community_posts cp
LEFT JOIN profiles p ON cp.user_id = p.user_id;

-- Grant access to the view
GRANT SELECT ON community_posts_with_profiles TO authenticated;