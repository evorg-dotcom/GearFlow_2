/*
  # Update existing community_posts table

  1. Tables
    - Ensure community_posts table has all required columns
    - Add missing columns if they don't exist
    
  2. Security
    - Update RLS policies if needed
    - Ensure proper access controls
    
  3. Functions and Views
    - Add search and trending functions
    - Create helper views for better data access
    
  4. Indexes and Constraints
    - Add performance indexes
    - Add data validation constraints
*/

-- Create post_category enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE post_category AS ENUM ('diagnostic', 'tuning', 'maintenance', 'general');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Ensure community_posts table exists with all required columns
DO $$ BEGIN
  -- Add missing columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'category') THEN
    ALTER TABLE community_posts ADD COLUMN category post_category;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'car_make') THEN
    ALTER TABLE community_posts ADD COLUMN car_make text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'car_model') THEN
    ALTER TABLE community_posts ADD COLUMN car_model text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'car_year') THEN
    ALTER TABLE community_posts ADD COLUMN car_year integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'upvotes') THEN
    ALTER TABLE community_posts ADD COLUMN upvotes integer NOT NULL DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'downvotes') THEN
    ALTER TABLE community_posts ADD COLUMN downvotes integer NOT NULL DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'replies_count') THEN
    ALTER TABLE community_posts ADD COLUMN replies_count integer NOT NULL DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'tags') THEN
    ALTER TABLE community_posts ADD COLUMN tags jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'solved') THEN
    ALTER TABLE community_posts ADD COLUMN solved boolean NOT NULL DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'community_posts' AND column_name = 'solved_votes') THEN
    ALTER TABLE community_posts ADD COLUMN solved_votes integer NOT NULL DEFAULT 0;
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist, create it
    CREATE TABLE community_posts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      title text NOT NULL,
      content text NOT NULL,
      category post_category NOT NULL,
      car_make text,
      car_model text,
      car_year integer,
      upvotes integer NOT NULL DEFAULT 0,
      downvotes integer NOT NULL DEFAULT 0,
      replies_count integer NOT NULL DEFAULT 0,
      tags jsonb,
      solved boolean NOT NULL DEFAULT false,
      solved_votes integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
END $$;

-- Ensure RLS is enabled
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_category_created_at ON community_posts(category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_car_info ON community_posts(car_make, car_model, car_year);

-- Create full-text search indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_community_posts_title_search ON community_posts USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_community_posts_content_search ON community_posts USING gin(to_tsvector('english', content));

-- Create GIN index for tags JSONB column (only if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING gin(tags);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_community_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS update_community_posts_updated_at ON community_posts;
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_community_posts_updated_at();

-- Create or replace view to join posts with user profiles
CREATE OR REPLACE VIEW community_posts_with_profiles AS
SELECT 
  cp.id,
  cp.user_id,
  cp.title,
  cp.content,
  cp.category,
  cp.car_make,
  cp.car_model,
  cp.car_year,
  cp.upvotes,
  cp.downvotes,
  cp.replies_count,
  cp.tags,
  cp.solved,
  cp.solved_votes,
  cp.created_at,
  cp.updated_at,
  p.display_name,
  p.avatar_url
FROM community_posts cp
LEFT JOIN profiles p ON cp.user_id = p.user_id;

-- Grant access to the view
GRANT SELECT ON community_posts_with_profiles TO authenticated;

-- Create function to validate tags array
CREATE OR REPLACE FUNCTION validate_community_post_tags(tags_input jsonb)
RETURNS boolean AS $$
BEGIN
  -- Allow null tags
  IF tags_input IS NULL THEN
    RETURN true;
  END IF;
  
  -- Must be an array
  IF jsonb_typeof(tags_input) != 'array' THEN
    RETURN false;
  END IF;
  
  -- Check array length (max 10 tags)
  IF jsonb_array_length(tags_input) > 10 THEN
    RETURN false;
  END IF;
  
  -- Check that all elements are strings and not too long
  IF EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(tags_input) AS tag
    WHERE jsonb_typeof(tag) != 'string' 
       OR length(tag #>> '{}') > 50
       OR length(trim(tag #>> '{}')) = 0
  ) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add constraints for data validation (only if they don't exist)
DO $$ BEGIN
  ALTER TABLE community_posts 
  ADD CONSTRAINT community_posts_upvotes_non_negative 
  CHECK (upvotes >= 0);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE community_posts 
  ADD CONSTRAINT community_posts_downvotes_non_negative 
  CHECK (downvotes >= 0);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE community_posts 
  ADD CONSTRAINT community_posts_replies_count_non_negative 
  CHECK (replies_count >= 0);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE community_posts 
  ADD CONSTRAINT community_posts_solved_votes_non_negative 
  CHECK (solved_votes >= 0);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE community_posts 
  ADD CONSTRAINT community_posts_car_year_valid 
  CHECK (car_year IS NULL OR (car_year >= 1900 AND car_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 2));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE community_posts 
  ADD CONSTRAINT community_posts_title_length 
  CHECK (length(trim(title)) >= 5 AND length(title) <= 200);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE community_posts 
  ADD CONSTRAINT community_posts_content_length 
  CHECK (length(trim(content)) >= 10 AND length(content) <= 10000);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE community_posts 
  ADD CONSTRAINT community_posts_tags_valid 
  CHECK (validate_community_post_tags(tags));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create function to search community posts
CREATE OR REPLACE FUNCTION search_community_posts(
  search_query text,
  category_filter post_category DEFAULT NULL,
  car_make_filter text DEFAULT NULL,
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  content text,
  category post_category,
  car_make text,
  car_model text,
  car_year integer,
  upvotes integer,
  downvotes integer,
  replies_count integer,
  tags jsonb,
  solved boolean,
  solved_votes integer,
  created_at timestamptz,
  updated_at timestamptz,
  display_name text,
  avatar_url text,
  search_rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    cp.user_id,
    cp.title,
    cp.content,
    cp.category,
    cp.car_make,
    cp.car_model,
    cp.car_year,
    cp.upvotes,
    cp.downvotes,
    cp.replies_count,
    cp.tags,
    cp.solved,
    cp.solved_votes,
    cp.created_at,
    cp.updated_at,
    p.display_name,
    p.avatar_url,
    (
      ts_rank(to_tsvector('english', cp.title), plainto_tsquery('english', search_query)) * 2.0 +
      ts_rank(to_tsvector('english', cp.content), plainto_tsquery('english', search_query))
    ) AS search_rank
  FROM community_posts cp
  LEFT JOIN profiles p ON cp.user_id = p.user_id
  WHERE 
    (search_query IS NULL OR search_query = '' OR
     to_tsvector('english', cp.title || ' ' || cp.content) @@ plainto_tsquery('english', search_query))
    AND (category_filter IS NULL OR cp.category = category_filter)
    AND (car_make_filter IS NULL OR lower(cp.car_make) = lower(car_make_filter))
  ORDER BY 
    search_rank DESC,
    cp.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on search function
GRANT EXECUTE ON FUNCTION search_community_posts(text, post_category, text, integer, integer) TO authenticated;

-- Create function to get trending posts
CREATE OR REPLACE FUNCTION get_trending_community_posts(
  time_period interval DEFAULT '7 days',
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  title text,
  content text,
  category post_category,
  car_make text,
  car_model text,
  car_year integer,
  upvotes integer,
  downvotes integer,
  replies_count integer,
  tags jsonb,
  solved boolean,
  solved_votes integer,
  created_at timestamptz,
  updated_at timestamptz,
  display_name text,
  avatar_url text,
  trend_score real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    cp.user_id,
    cp.title,
    cp.content,
    cp.category,
    cp.car_make,
    cp.car_model,
    cp.car_year,
    cp.upvotes,
    cp.downvotes,
    cp.replies_count,
    cp.tags,
    cp.solved,
    cp.solved_votes,
    cp.created_at,
    cp.updated_at,
    p.display_name,
    p.avatar_url,
    (
      (cp.upvotes - cp.downvotes) * 1.0 +
      cp.replies_count * 0.5 +
      CASE WHEN cp.solved THEN cp.solved_votes * 2.0 ELSE 0 END +
      -- Recency bonus (newer posts get higher score)
      EXTRACT(EPOCH FROM (now() - cp.created_at)) / -86400.0 * 0.1
    ) AS trend_score
  FROM community_posts cp
  LEFT JOIN profiles p ON cp.user_id = p.user_id
  WHERE cp.created_at >= (now() - time_period)
  ORDER BY trend_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on trending function
GRANT EXECUTE ON FUNCTION get_trending_community_posts(interval, integer) TO authenticated;