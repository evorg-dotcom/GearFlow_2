/*
  # Add vehicles_count to profiles table

  1. Changes
    - Add `vehicles_count` column to profiles table
    - Set default value to 1
    - Add constraint to ensure positive values

  2. Security
    - Existing RLS policies will apply to the new column
*/

-- Add vehicles_count column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS vehicles_count integer NOT NULL DEFAULT 1;

-- Add constraint to ensure vehicles_count is positive
ALTER TABLE profiles 
ADD CONSTRAINT profiles_vehicles_count_positive 
CHECK (vehicles_count > 0);

-- Create index for potential queries
CREATE INDEX IF NOT EXISTS profiles_vehicles_count_idx ON profiles(vehicles_count);