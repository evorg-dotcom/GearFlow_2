/*
  # Add vehicles_count to profiles table

  1. Changes
    - Add `vehicles_count` column to profiles table if it doesn't exist
    - Add constraint to ensure positive values if it doesn't exist
    - Create index if it doesn't exist

  2. Security
    - Existing RLS policies will apply to the new column
*/

-- Add vehicles_count column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'vehicles_count'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN vehicles_count integer NOT NULL DEFAULT 1;
  END IF;
END $$;

-- Add constraint to ensure vehicles_count is positive if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'vehicles_count_positive' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles 
    ADD CONSTRAINT vehicles_count_positive 
    CHECK (vehicles_count >= 1);
  END IF;
END $$;

-- Create index for potential queries if it doesn't exist
CREATE INDEX IF NOT EXISTS profiles_vehicles_count_idx ON profiles(vehicles_count);