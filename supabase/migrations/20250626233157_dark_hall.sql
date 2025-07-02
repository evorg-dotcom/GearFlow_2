/*
  # Fix get_diagnostic_suggestions function

  1. Changes
     - Rewrites the get_diagnostic_suggestions function to fix the SQL error
     - Consolidates all aggregations into a single SELECT statement
     - Ensures all CTEs are properly scoped and referenced
     - Improves error handling and fallback responses
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
BEGIN
  -- Find matches and build the complete result in a single query
  WITH symptom_matches AS (
    SELECT 
      di.id,
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
  -- Get top matches with highest confidence
  top_matches AS (
    SELECT *
    FROM symptom_matches
    WHERE overall_confidence > 0.1
    ORDER BY overall_confidence DESC
    LIMIT 10
  ),
  -- Extract and count causes
  cause_counts AS (
    SELECT 
      cause,
      COUNT(*) as frequency,
      AVG(m.overall_confidence) as avg_confidence
    FROM top_matches m,
         jsonb_array_elements_text(m.possible_causes) as cause
    GROUP BY cause
    ORDER BY frequency DESC, avg_confidence DESC
    LIMIT 5
  ),
  -- Extract and count actions
  action_counts AS (
    SELECT 
      action,
      COUNT(*) as frequency,
      AVG(m.overall_confidence) as avg_confidence
    FROM top_matches m,
         jsonb_array_elements_text(m.recommended_actions) as action
    GROUP BY action
    ORDER BY frequency DESC, avg_confidence DESC
    LIMIT 5
  ),
  -- Prepare similar issues data
  similar_issues AS (
    SELECT 
      jsonb_build_object(
        'title', issue_title,
        'severity', severity,
        'estimated_cost', estimated_cost,
        'confidence', overall_confidence
      ) as issue_data
    FROM top_matches
    ORDER BY overall_confidence DESC
    LIMIT 3
  ),
  -- Count total available diagnostic issues
  total_count AS (
    SELECT COUNT(*) as count
    FROM diagnostic_issues 
    WHERE symptoms IS NOT NULL 
      AND LENGTH(TRIM(symptoms)) > 0
  )
  -- Build the final result
  SELECT 
    jsonb_build_object(
      'common_causes', COALESCE(
        (SELECT jsonb_agg(cause ORDER BY frequency DESC, avg_confidence DESC) FROM cause_counts),
        jsonb_build_array('Unknown cause - requires professional diagnosis')
      ),
      'common_actions', COALESCE(
        (SELECT jsonb_agg(action ORDER BY frequency DESC, avg_confidence DESC) FROM action_counts),
        jsonb_build_array('Consult a qualified mechanic', 'Perform basic visual inspection')
      ),
      'similar_issues', COALESCE(
        (SELECT jsonb_agg(issue_data) FROM similar_issues),
        '[]'::jsonb
      ),
      'confidence_score', COALESCE(
        (SELECT MAX(overall_confidence) FROM top_matches),
        0
      ),
      'total_matches', (SELECT count FROM total_count)
    )
  INTO result;

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return a safe fallback result in case of any errors
    RETURN jsonb_build_object(
      'error', SQLERRM,
      'common_causes', jsonb_build_array('Unable to determine - consult a mechanic'),
      'common_actions', jsonb_build_array('Professional diagnostic recommended'),
      'similar_issues', '[]'::jsonb,
      'confidence_score', 0,
      'total_matches', 0
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_diagnostic_suggestions(text, text, text, integer) TO authenticated;