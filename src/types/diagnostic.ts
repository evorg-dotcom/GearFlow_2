// Diagnostic types that match the Supabase schema
export interface DiagnosticIssue {
  id: string;
  user_id: string | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: number | null;
  symptoms: string | null;
  issue_title: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical' | null;
  urgency: 'immediate' | 'soon' | 'moderate' | 'low' | null;
  possible_causes: string[] | null;
  recommended_actions: string[] | null;
  estimated_cost: string | null;
  diagnostic_type: 'manual' | 'obd' | null;
  diagnostic_data: any | null;
  repair_status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | null;
  custom_name: string | null;
  tags: string[] | null;
  notes: string | null;
  is_bookmarked: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DiagnosticResult {
  id: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  possibleCauses: string[];
  recommendedActions: string[];
  estimatedCost: string;
  urgency: 'immediate' | 'soon' | 'moderate' | 'low';
  consequences: string[];
  affectedComponents: {
    name: string;
    condition: 'good' | 'fair' | 'poor' | 'critical';
    replacementCost: string;
  }[];
  repairDetails: {
    laborHours: number;
    laborRate: number;
    partsCost: string;
    totalCost: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  };
  resources: {
    guides: Array<{
      title: string;
      difficulty: string;
      duration: string;
      rating: number;
      url: string;
    }>;
    videos: Array<{
      title: string;
      channel: string;
      duration: string;
      views: string;
      rating: number;
      url: string;
    }>;
    documentation: Array<{
      title: string;
      type: string;
      source: string;
      url: string;
    }>;
    forumDiscussions: Array<{
      title: string;
      replies: number;
      solved: boolean;
      lastActivity: string;
      url: string;
    }>;
    parts: Array<{
      name: string;
      brand: string;
      price: string;
      availability: string;
      rating: number;
      vendor: string;
      url: string;
    }>;
  };
  timestamp: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: string;
  };
  diagnosticType: 'manual' | 'obd';
  customName?: string;
  tags?: string[];
  notes?: string;
  isBookmarked?: boolean;
  repairStatus?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

// Helper function to convert DiagnosticIssue to DiagnosticResult
export function convertDiagnosticIssueToResult(issue: DiagnosticIssue): DiagnosticResult {
  // Extract possible causes and recommended actions from database
  const possibleCauses = issue.possible_causes || [];
  const recommendedActions = issue.recommended_actions || [];
  
  // Generate consequences based on severity
  const consequences = [];
  if (issue.severity === 'critical' || issue.severity === 'high') {
    consequences.push('Potential vehicle damage if left untreated');
    consequences.push('Safety risk while driving');
    consequences.push('Increased repair costs if delayed');
  } else if (issue.severity === 'medium') {
    consequences.push('Reduced vehicle performance');
    consequences.push('Potential for more serious issues if ignored');
    consequences.push('Possible decrease in fuel efficiency');
  } else {
    consequences.push('Minor impact on vehicle performance');
    consequences.push('Potential for gradual deterioration');
  }
  
  // Generate affected components based on diagnostic data
  const affectedComponents = [];
  if (issue.diagnostic_data && issue.diagnostic_data.affectedComponents) {
    // Use stored components if available
    affectedComponents.push(...issue.diagnostic_data.affectedComponents);
  } else {
    // Generate generic components based on symptoms
    if (issue.symptoms && issue.symptoms.toLowerCase().includes('engine')) {
      affectedComponents.push({ 
        name: 'Engine Components', 
        condition: issue.severity === 'critical' ? 'critical' : 
                  issue.severity === 'high' ? 'poor' : 
                  issue.severity === 'medium' ? 'fair' : 'good',
        replacementCost: '$500 - $3000'
      });
    }
    
    if (issue.symptoms && (issue.symptoms.toLowerCase().includes('brake') || issue.symptoms.toLowerCase().includes('stopping'))) {
      affectedComponents.push({ 
        name: 'Brake System', 
        condition: issue.severity === 'critical' ? 'critical' : 
                  issue.severity === 'high' ? 'poor' : 'fair',
        replacementCost: '$200 - $800'
      });
    }
    
    // Add a generic component if none were identified
    if (affectedComponents.length === 0) {
      affectedComponents.push({ 
        name: 'Vehicle Components', 
        condition: issue.severity === 'critical' ? 'critical' : 
                  issue.severity === 'high' ? 'poor' : 
                  issue.severity === 'medium' ? 'fair' : 'good',
        replacementCost: '$200 - $1000'
      });
    }
  }
  
  // Calculate repair details
  const laborRate = 120;
  let laborHours = issue.severity === 'critical' ? 4 :
                  issue.severity === 'high' ? 3 :
                  issue.severity === 'medium' ? 2 : 1;
  
  // Calculate parts cost range based on affected components
  const minPartsCost = affectedComponents.reduce((sum, component) => {
    const costRange = component.replacementCost.match(/\$(\d+)\s*-\s*\$(\d+)/);
    return sum + (costRange ? parseInt(costRange[1]) : 100);
  }, 0);
  
  const maxPartsCost = affectedComponents.reduce((sum, component) => {
    const costRange = component.replacementCost.match(/\$(\d+)\s*-\s*\$(\d+)/);
    return sum + (costRange ? parseInt(costRange[2]) : 500);
  }, 0);
  
  const partsCost = `$${minPartsCost} - $${maxPartsCost}`;
  
  // Calculate total cost
  const minTotalCost = minPartsCost + (laborHours * laborRate);
  const maxTotalCost = maxPartsCost + (laborHours * laborRate);
  const totalCost = `$${minTotalCost} - $${maxTotalCost}`;
  
  // Determine repair difficulty
  let difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium';
  if (issue.severity === 'critical') difficulty = 'expert';
  else if (issue.severity === 'high') difficulty = 'hard';
  else if (issue.severity === 'low') difficulty = 'easy';

  return {
    id: issue.id,
    issue: issue.issue_title || 'Unknown Issue',
    severity: issue.severity || 'medium',
    description: issue.symptoms || '',
    possibleCauses,
    recommendedActions,
    estimatedCost: issue.estimated_cost || 'Unknown',
    urgency: issue.urgency || 'moderate',
    consequences,
    affectedComponents,
    repairDetails: {
      laborHours,
      laborRate,
      partsCost,
      totalCost,
      difficulty
    },
    resources: {
      guides: [],
      videos: [],
      documentation: [],
      forumDiscussions: [],
      parts: []
    },
    timestamp: issue.created_at ? new Date(issue.created_at).getTime() : Date.now(),
    vehicleInfo: issue.vehicle_make && issue.vehicle_model && issue.vehicle_year ? {
      make: issue.vehicle_make,
      model: issue.vehicle_model,
      year: issue.vehicle_year.toString()
    } : undefined,
    diagnosticType: issue.diagnostic_type || 'manual',
    customName: issue.custom_name || undefined,
    tags: issue.tags || undefined,
    notes: issue.notes || undefined,
    isBookmarked: issue.is_bookmarked || false,
    repairStatus: issue.repair_status || 'pending'
  };
}

// Helper function to convert DiagnosticResult to DiagnosticIssue for database storage
export function convertDiagnosticResultToIssue(result: DiagnosticResult, userId: string): Omit<DiagnosticIssue, 'id' | 'created_at' | 'updated_at'> {
  // Store additional diagnostic data for future reference
  const diagnosticData = {
    affectedComponents: result.affectedComponents,
    consequences: result.consequences,
    repairDetails: result.repairDetails,
    resources: result.resources
  };

  return {
    user_id: userId,
    vehicle_make: result.vehicleInfo?.make || null,
    vehicle_model: result.vehicleInfo?.model || null,
    vehicle_year: result.vehicleInfo?.year ? parseInt(result.vehicleInfo.year) : null,
    symptoms: result.description || null,
    issue_title: result.issue || null,
    severity: result.severity,
    urgency: result.urgency,
    possible_causes: result.possibleCauses.length > 0 ? result.possibleCauses : null,
    recommended_actions: result.recommendedActions.length > 0 ? result.recommendedActions : null,
    estimated_cost: result.estimatedCost || null,
    diagnostic_type: result.diagnosticType || 'manual',
    diagnostic_data: diagnosticData,
    repair_status: result.repairStatus || 'pending',
    custom_name: result.customName || null,
    tags: result.tags && result.tags.length > 0 ? result.tags : null,
    notes: result.notes || null,
    is_bookmarked: result.isBookmarked || false
  };
}