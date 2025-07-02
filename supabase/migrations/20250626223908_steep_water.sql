/*
  # Fix Diagnostic Matching Function Migration

  1. Drop existing functions that may have parameter conflicts
  2. Recreate all functions with correct parameter names
  3. Add proper indexes for performance
  4. Grant necessary permissions

  This migration fixes the parameter name conflict error by properly dropping
  and recreating the functions with consistent parameter naming.
*/

-- Drop existing functions to avoid parameter conflicts
DROP FUNCTION IF EXISTS extract_keywords(text);
DROP FUNCTION IF EXISTS calculate_symptom_similarity(text, text);
DROP FUNCTION IF EXISTS get_vehicle_compatibility_score(text, text, integer, text, text, integer);
DROP FUNCTION IF EXISTS match_diagnostic_symptoms(text, text, text, integer, integer, numeric);
DROP FUNCTION IF EXISTS get_diagnostic_suggestions(text, text, text, integer);
DROP FUNCTION IF EXISTS log_diagnostic_search(text, text, text, integer, integer, numeric);

-- Create function to extract keywords from text
CREATE OR REPLACE FUNCTION extract_keywords(input_text text)
RETURNS text[] AS $$
DECLARE
  keywords text[];
  word text;
  common_words text[] := ARRAY['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their'];
BEGIN
  -- Convert to lowercase and split into words
  SELECT array_agg(DISTINCT lower(word))
  INTO keywords
  FROM (
    SELECT unnest(string_to_array(regexp_replace(lower(input_text), '[^a-zA-Z0-9\s]', ' ', 'g'), ' ')) AS word
  ) words
  WHERE length(word) > 2 
    AND word NOT IN (SELECT unnest(common_words))
    AND word ~ '^[a-zA-Z0-9]+$';
  
  RETURN COALESCE(keywords, ARRAY[]::text[]);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to calculate text similarity using keyword matching
CREATE OR REPLACE FUNCTION calculate_symptom_similarity(
  input_symptoms text,
  stored_symptoms text
)
RETURNS numeric AS $$
DECLARE
  input_keywords text[];
  stored_keywords text[];
  common_keywords text[];
  similarity_score numeric := 0;
  total_keywords integer;
BEGIN
  -- Extract keywords from both texts
  input_keywords := extract_keywords(input_symptoms);
  stored_keywords := extract_keywords(stored_symptoms);
  
  -- Find common keywords
  SELECT array_agg(keyword)
  INTO common_keywords
  FROM (
    SELECT unnest(input_keywords) AS keyword
    INTERSECT
    SELECT unnest(stored_keywords) AS keyword
  ) common;
  
  -- Calculate similarity score
  total_keywords := array_length(input_keywords, 1) + array_length(stored_keywords, 1);
  
  IF total_keywords > 0 AND common_keywords IS NOT NULL THEN
    similarity_score := (array_length(common_keywords, 1) * 2.0) / total_keywords;
  END IF;
  
  -- Add bonus for exact phrase matches
  IF position(lower(input_symptoms) in lower(stored_symptoms)) > 0 OR 
     position(lower(stored_symptoms) in lower(input_symptoms)) > 0 THEN
    similarity_score := similarity_score + 0.2;
  END IF;
  
  RETURN LEAST(similarity_score, 1.0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to calculate vehicle compatibility score
CREATE OR REPLACE FUNCTION get_vehicle_compatibility_score(
  input_make text,
  input_model text,
  input_year integer,
  stored_make text,
  stored_model text,
  stored_year integer
)
RETURNS numeric AS $$
DECLARE
  score numeric := 0;
  year_diff integer;
BEGIN
  -- Exact make match
  IF lower(input_make) = lower(stored_make) THEN
    score := score + 0.4;
    
    -- Exact model match
    IF lower(input_model) = lower(stored_model) THEN
      score := score + 0.4;
      
      -- Year proximity scoring
      year_diff := abs(input_year - stored_year);
      IF year_diff = 0 THEN
        score := score + 0.2;
      ELSIF year_diff <= 2 THEN
        score := score + 0.15;
      ELSIF year_diff <= 5 THEN
        score := score + 0.1;
      ELSIF year_diff <= 10 THEN
        score := score + 0.05;
      END IF;
    ELSE
      -- Partial model match (same make, different model)
      score := score + 0.1;
    END IF;
  ELSE
    -- Check for similar makes (e.g., Honda/Acura, Toyota/Lexus)
    IF (lower(input_make) IN ('honda', 'acura') AND lower(stored_make) IN ('honda', 'acura')) OR
       (lower(input_make) IN ('toyota', 'lexus', 'scion') AND lower(stored_make) IN ('toyota', 'lexus', 'scion')) OR
       (lower(input_make) IN ('nissan', 'infiniti') AND lower(stored_make) IN ('nissan', 'infiniti')) OR
       (lower(input_make) IN ('ford', 'lincoln', 'mercury') AND lower(stored_make) IN ('ford', 'lincoln', 'mercury')) OR
       (lower(input_make) IN ('chevrolet', 'gmc', 'cadillac', 'buick') AND lower(stored_make) IN ('chevrolet', 'gmc', 'cadillac', 'buick')) OR
       (lower(input_make) IN ('volkswagen', 'audi', 'porsche') AND lower(stored_make) IN ('volkswagen', 'audi', 'porsche')) OR
       (lower(input_make) IN ('bmw', 'mini') AND lower(stored_make) IN ('bmw', 'mini')) THEN
      score := score + 0.2;
    END IF;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Main function to match diagnostic symptoms
CREATE OR REPLACE FUNCTION match_diagnostic_symptoms(
  input_symptoms text,
  input_make text,
  input_model text,
  input_year integer,
  match_limit integer DEFAULT 10,
  min_confidence numeric DEFAULT 0.3
)
RETURNS TABLE (
  diagnostic_id uuid,
  issue_title text,
  symptoms text,
  severity diagnostic_severity,
  urgency diagnostic_urgency,
  possible_causes jsonb,
  recommended_actions jsonb,
  estimated_cost text,
  vehicle_make text,
  vehicle_model text,
  vehicle_year integer,
  symptom_similarity numeric,
  vehicle_compatibility numeric,
  overall_confidence numeric,
  diagnostic_type diagnostic_type,
  repair_status repair_status,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  WITH symptom_matches AS (
    SELECT 
      di.id,
      di.issue_title,
      di.symptoms,
      di.severity,
      di.urgency,
      di.possible_causes,
      di.recommended_actions,
      di.estimated_cost,
      di.vehicle_make,
      di.vehicle_model,
      di.vehicle_year,
      di.diagnostic_type,
      di.repair_status,
      di.created_at,
      calculate_symptom_similarity(input_symptoms, di.symptoms) AS symptom_sim,
      get_vehicle_compatibility_score(
        input_make, input_model, input_year,
        di.vehicle_make, di.vehicle_model, di.vehicle_year
      ) AS vehicle_comp
    FROM diagnostic_issues di
    WHERE 
      -- Only include issues with some symptom similarity
      calculate_symptom_similarity(input_symptoms, di.symptoms) > 0.1
      -- Exclude user's own diagnostics to avoid self-matching
      AND di.user_id != auth.uid()
  ),
  scored_matches AS (
    SELECT 
      *,
      -- Calculate overall confidence score
      -- Symptom similarity weighted 70%, vehicle compatibility 30%
      (symptom_sim * 0.7 + vehicle_comp * 0.3) AS confidence,
      -- Add severity bonus (higher severity issues get slight boost)
      CASE 
        WHEN severity = 'critical' THEN 0.1
        WHEN severity = 'high' THEN 0.05
        ELSE 0
      END AS severity_bonus
    FROM symptom_matches
  )
  SELECT 
    sm.id,
    sm.issue_title,
    sm.symptoms,
    sm.severity,
    sm.urgency,
    sm.possible_causes,
    sm.recommended_actions,
    sm.estimated_cost,
    sm.vehicle_make,
    sm.vehicle_model,
    sm.vehicle_year,
    sm.symptom_sim,
    sm.vehicle_comp,
    LEAST(sm.confidence + sm.severity_bonus, 1.0) AS overall_confidence,
    sm.diagnostic_type,
    sm.repair_status,
    sm.created_at
  FROM scored_matches sm
  WHERE sm.confidence >= min_confidence
  ORDER BY 
    (sm.confidence + sm.severity_bonus) DESC,
    sm.created_at DESC
  LIMIT match_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get diagnostic suggestions based on vehicle and symptoms
CREATE OR REPLACE FUNCTION get_diagnostic_suggestions(
  input_symptoms text,
  input_make text,
  input_model text,
  input_year integer
)
RETURNS jsonb AS $$
DECLARE
  matches_result jsonb;
BEGIN
  -- Get matching diagnostics and build comprehensive response
  WITH matches AS (
    SELECT * FROM match_diagnostic_symptoms(
      input_symptoms, input_make, input_model, input_year, 20, 0.2
    )
  ),
  match_stats AS (
    SELECT 
      count(*) as total,
      count(*) FILTER (WHERE overall_confidence >= 0.6) as high_conf,
      avg(overall_confidence) as avg_conf
    FROM matches
  ),
  common_causes AS (
    SELECT 
      jsonb_agg(DISTINCT cause) as causes
    FROM matches m,
    jsonb_array_elements_text(m.possible_causes) as cause
    WHERE m.overall_confidence >= 0.4
  ),
  common_actions AS (
    SELECT 
      jsonb_agg(DISTINCT action) as actions
    FROM matches m,
    jsonb_array_elements_text(m.recommended_actions) as action
    WHERE m.overall_confidence >= 0.4
  ),
  vehicle_issues AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'issue_title', issue_title,
          'confidence', overall_confidence,
          'severity', severity,
          'estimated_cost', estimated_cost
        )
      ) as issues
    FROM matches
    WHERE vehicle_compatibility >= 0.5
    ORDER BY overall_confidence DESC
    LIMIT 5
  )
  SELECT 
    jsonb_build_object(
      'total_matches', ms.total,
      'high_confidence_matches', ms.high_conf,
      'average_confidence', round(ms.avg_conf, 3),
      'common_causes', COALESCE(cc.causes, '[]'::jsonb),
      'common_actions', COALESCE(ca.actions, '[]'::jsonb),
      'vehicle_specific_issues', COALESCE(vi.issues, '[]'::jsonb),
      'top_matches', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', diagnostic_id,
            'issue_title', issue_title,
            'confidence', overall_confidence,
            'severity', severity,
            'vehicle', vehicle_make || ' ' || vehicle_model || ' ' || vehicle_year,
            'estimated_cost', estimated_cost
          )
        )
        FROM matches
        ORDER BY overall_confidence DESC
        LIMIT 5
      )
    )
  INTO matches_result
  FROM match_stats ms
  CROSS JOIN common_causes cc
  CROSS JOIN common_actions ca
  CROSS JOIN vehicle_issues vi;
  
  RETURN COALESCE(matches_result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log diagnostic searches for analytics (placeholder for future use)
CREATE OR REPLACE FUNCTION log_diagnostic_search(
  search_symptoms text,
  search_make text,
  search_model text,
  search_year integer,
  matches_found integer,
  avg_confidence numeric
)
RETURNS void AS $$
BEGIN
  -- Placeholder for future analytics logging
  -- This could be useful for improving the matching algorithm over time
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION extract_keywords(text) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_symptom_similarity(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_vehicle_compatibility_score(text, text, integer, text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION match_diagnostic_symptoms(text, text, text, integer, integer, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION get_diagnostic_suggestions(text, text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION log_diagnostic_search(text, text, text, integer, integer, numeric) TO authenticated;

-- Create indexes to improve matching performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_diagnostic_symptoms_gin ON diagnostic_issues USING gin(to_tsvector('english', symptoms));
CREATE INDEX IF NOT EXISTS idx_diagnostic_vehicle_make ON diagnostic_issues(lower(vehicle_make));
CREATE INDEX IF NOT EXISTS idx_diagnostic_vehicle_model ON diagnostic_issues(lower(vehicle_model));
CREATE INDEX IF NOT EXISTS idx_diagnostic_vehicle_year ON diagnostic_issues(vehicle_year);
CREATE INDEX IF NOT EXISTS idx_diagnostic_severity_created ON diagnostic_issues(severity, created_at DESC);

-- Create composite index for vehicle matching
CREATE INDEX IF NOT EXISTS idx_diagnostic_vehicle_composite ON diagnostic_issues(lower(vehicle_make), lower(vehicle_model), vehicle_year);

-- Create additional performance indexes
CREATE INDEX IF NOT EXISTS idx_diagnostic_user_id_created_at ON diagnostic_issues(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_diagnostic_repair_status ON diagnostic_issues(repair_status);
CREATE INDEX IF NOT EXISTS idx_diagnostic_severity ON diagnostic_issues(severity);