/*
  # Fix get_diagnostic_suggestions RPC function

  1. Function Updates
    - Fix the GROUP BY clause issue with matches.overall_confidence
    - Ensure all selected columns are properly aggregated or grouped
    - Maintain the function's original purpose while fixing the SQL syntax

  2. Changes Made
    - Add proper aggregate functions for confidence scores
    - Ensure GROUP BY clause includes all non-aggregated columns
    - Fix any other potential grouping issues
*/

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_diagnostic_suggestions(text, text, text, integer);

-- Create the corrected get_diagnostic_suggestions function
CREATE OR REPLACE FUNCTION get_diagnostic_suggestions(
  input_symptoms text,
  input_make text,
  input_model text,
  input_year integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  common_causes text[];
  common_actions text[];
  similar_issues jsonb[];
  confidence_score numeric;
BEGIN
  -- Initialize arrays
  common_causes := ARRAY[]::text[];
  common_actions := ARRAY[]::text[];
  similar_issues := ARRAY[]::jsonb[];
  confidence_score := 0.0;

  -- Find common causes from similar diagnostic issues
  WITH symptom_matches AS (
    SELECT 
      di.possible_causes,
      di.recommended_actions,
      di.issue_title,
      di.severity,
      di.estimated_cost,
      -- Calculate similarity score based on symptoms, make, model
      CASE 
        WHEN LOWER(di.vehicle_make) = LOWER(input_make) AND 
             LOWER(di.vehicle_model) = LOWER(input_model) THEN 0.4
        WHEN LOWER(di.vehicle_make) = LOWER(input_make) THEN 0.2
        ELSE 0.0
      END +
      CASE 
        WHEN di.vehicle_year = input_year THEN 0.2
        WHEN ABS(di.vehicle_year - input_year) <= 2 THEN 0.1
        ELSE 0.0
      END +
      -- Text similarity for symptoms (simplified)
      CASE 
        WHEN LOWER(di.symptoms) LIKE '%' || LOWER(input_symptoms) || '%' OR
             LOWER(input_symptoms) LIKE '%' || LOWER(di.symptoms) || '%' THEN 0.4
        WHEN similarity(LOWER(di.symptoms), LOWER(input_symptoms)) > 0.3 THEN 0.3
        WHEN similarity(LOWER(di.symptoms), LOWER(input_symptoms)) > 0.2 THEN 0.2
        ELSE 0.0
      END AS overall_confidence
    FROM diagnostic_issues di
    WHERE 
      di.possible_causes IS NOT NULL 
      AND di.recommended_actions IS NOT NULL
      AND di.symptoms IS NOT NULL
      AND LENGTH(TRIM(di.symptoms)) > 0
  ),
  aggregated_matches AS (
    SELECT 
      possible_causes,
      recommended_actions,
      issue_title,
      severity,
      estimated_cost,
      MAX(overall_confidence) as max_confidence
    FROM symptom_matches
    WHERE overall_confidence > 0.1
    GROUP BY possible_causes, recommended_actions, issue_title, severity, estimated_cost
    ORDER BY max_confidence DESC
    LIMIT 10
  )
  SELECT 
    COALESCE(MAX(max_confidence), 0.0)
  INTO confidence_score
  FROM aggregated_matches;

  -- Extract common causes from top matches
  WITH cause_frequency AS (
    SELECT 
      cause,
      COUNT(*) as frequency,
      AVG(am.max_confidence) as avg_confidence
    FROM aggregated_matches am,
         jsonb_array_elements_text(am.possible_causes) as cause
    GROUP BY cause
    ORDER BY frequency DESC, avg_confidence DESC
    LIMIT 5
  )
  SELECT array_agg(cause ORDER BY frequency DESC)
  INTO common_causes
  FROM cause_frequency;

  -- Extract common actions from top matches
  WITH action_frequency AS (
    SELECT 
      action,
      COUNT(*) as frequency,
      AVG(am.max_confidence) as avg_confidence
    FROM aggregated_matches am,
         jsonb_array_elements_text(am.recommended_actions) as action
    GROUP BY action
    ORDER BY frequency DESC, avg_confidence DESC
    LIMIT 5
  )
  SELECT array_agg(action ORDER BY frequency DESC)
  INTO common_actions
  FROM action_frequency;

  -- Get similar issues for reference
  WITH similar_issues_data AS (
    SELECT 
      jsonb_build_object(
        'title', issue_title,
        'severity', severity,
        'estimated_cost', estimated_cost,
        'confidence', max_confidence
      ) as issue_data
    FROM aggregated_matches
    ORDER BY max_confidence DESC
    LIMIT 3
  )
  SELECT array_agg(issue_data)
  INTO similar_issues
  FROM similar_issues_data;

  -- Build the result
  result := jsonb_build_object(
    'common_causes', COALESCE(common_causes, ARRAY['Unknown cause - requires professional diagnosis']),
    'common_actions', COALESCE(common_actions, ARRAY['Consult a qualified mechanic', 'Perform basic visual inspection']),
    'similar_issues', COALESCE(similar_issues, ARRAY[]::jsonb[]),
    'confidence_score', confidence_score,
    'total_matches', (
      SELECT COUNT(*) 
      FROM diagnostic_issues 
      WHERE symptoms IS NOT NULL 
        AND LENGTH(TRIM(symptoms)) > 0
    )
  );

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return a safe fallback result in case of any errors
    RETURN jsonb_build_object(
      'common_causes', ARRAY['Unable to determine - consult a mechanic'],
      'common_actions', ARRAY['Professional diagnostic recommended'],
      'similar_issues', ARRAY[]::jsonb[],
      'confidence_score', 0.0,
      'total_matches', 0,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_diagnostic_suggestions(text, text, text, integer) TO authenticated;