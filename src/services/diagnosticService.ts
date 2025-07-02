import { supabase } from '../config/supabase';
import type { DiagnosticIssue, DiagnosticResult } from '../types/diagnostic';
import { convertDiagnosticIssueToResult, convertDiagnosticResultToIssue } from '../types/diagnostic';
import { EnhancedDiagnosticService } from './enhancedDiagnosticService';
import { ComponentMatcher } from '../data/componentDatabase';

export interface ValidationError {
  field: string;
  message: string;
}

export interface DiagnosticFormData {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  symptoms: string;
  issueTitle: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'immediate' | 'soon' | 'moderate' | 'low';
  estimatedCost?: string;
  customName?: string;
  notes?: string;
}

export class DiagnosticService {
  /**
   * Validate form data before submission
   */
  static validateFormData(formData: DiagnosticFormData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate vehicle make
    if (!formData.vehicleMake.trim()) {
      errors.push({ field: 'vehicleMake', message: 'Vehicle make is required' });
    } else if (formData.vehicleMake.length > 50) {
      errors.push({ field: 'vehicleMake', message: 'Vehicle make must be 50 characters or less' });
    }

    // Validate vehicle model
    if (!formData.vehicleModel.trim()) {
      errors.push({ field: 'vehicleModel', message: 'Vehicle model is required' });
    } else if (formData.vehicleModel.length > 50) {
      errors.push({ field: 'vehicleModel', message: 'Vehicle model must be 50 characters or less' });
    }

    // Validate vehicle year
    const currentYear = new Date().getFullYear();
    if (!formData.vehicleYear) {
      errors.push({ field: 'vehicleYear', message: 'Vehicle year is required' });
    } else if (formData.vehicleYear < 1990 || formData.vehicleYear > currentYear + 1) {
      errors.push({ field: 'vehicleYear', message: `Year must be between 1990 and ${currentYear + 1}` });
    }

    // Validate symptoms
    if (!formData.symptoms.trim()) {
      errors.push({ field: 'symptoms', message: 'Symptoms are required' });
    } else if (formData.symptoms.length < 10) {
      errors.push({ field: 'symptoms', message: 'Please provide more details about the symptoms' });
    } else if (formData.symptoms.length > 2000) {
      errors.push({ field: 'symptoms', message: 'Symptoms must be 2000 characters or less' });
    }

    // Validate issue title
    if (!formData.issueTitle.trim()) {
      errors.push({ field: 'issueTitle', message: 'Issue title is required' });
    } else if (formData.issueTitle.length > 200) {
      errors.push({ field: 'issueTitle', message: 'Issue title must be 200 characters or less' });
    }

    // Validate custom name if provided
    if (formData.customName && formData.customName.length > 100) {
      errors.push({ field: 'customName', message: 'Custom name must be 100 characters or less' });
    }

    // Validate notes if provided
    if (formData.notes && formData.notes.length > 1000) {
      errors.push({ field: 'notes', message: 'Notes must be 1000 characters or less' });
    }

    return errors;
  }

  /**
   * Get diagnostic suggestions from Supabase RPC function
   */
  static async getDiagnosticSuggestions(
    symptoms: string,
    make: string,
    model: string,
    year: number
  ): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('get_diagnostic_suggestions', {
        input_symptoms: symptoms,
        input_make: make,
        input_model: model,
        input_year: year
      });

      if (error) {
        console.error('Error getting diagnostic suggestions:', error);
        throw new Error(`Failed to get diagnostic suggestions: ${error.message}`);
      }

      return data || {};
    } catch (error) {
      console.error('Error in getDiagnosticSuggestions:', error);
      throw error;
    }
  }

  /**
   * Generate diagnostic results based on form data and suggestions
   */
  static generateDiagnosticResults(
    formData: DiagnosticFormData,
    suggestions: any
  ): DiagnosticResult[] {
    // Generate enhanced diagnostic with specific components and realistic pricing
    const enhancedDiagnostic = EnhancedDiagnosticService.generateEnhancedDiagnostic(formData);
    
    // Extract common causes and actions from suggestions
    const possibleCauses = Array.isArray(suggestions.common_causes) 
      ? suggestions.common_causes.slice(0, 5) 
      : ['Unknown cause'];
    
    const recommendedActions = Array.isArray(suggestions.common_actions)
      ? suggestions.common_actions.slice(0, 5)
      : ['Consult a mechanic'];

    // Convert enhanced diagnostic components to legacy format
    const affectedComponents = enhancedDiagnostic.affectedComponents.map(comp => ({
      name: comp.component.name,
      condition: comp.condition,
      replacementCost: `${comp.replacementCost} + ${comp.laborCost} labor`
    }));

    // Generate consequences based on enhanced diagnostic
    const consequences = [];
    if (enhancedDiagnostic.safetyRisk === 'critical' || enhancedDiagnostic.safetyRisk === 'high') {
      consequences.push('Potential safety hazard - immediate attention required');
      consequences.push('Risk of further damage if not addressed promptly');
      consequences.push('Possible breakdown or failure while driving');
    } else if (enhancedDiagnostic.safetyRisk === 'medium') {
      consequences.push('Reduced vehicle performance and reliability');
      consequences.push('Potential for more serious issues if ignored');
      consequences.push('Increased repair costs if delayed');
    } else {
      consequences.push('Minor impact on vehicle performance');
      consequences.push('Gradual deterioration over time');
    }
    
    // Calculate average difficulty from components
    const difficultyMap = { easy: 1, medium: 2, hard: 3, expert: 4 };
    const avgDifficulty = enhancedDiagnostic.affectedComponents.reduce((sum, comp) => 
      sum + difficultyMap[comp.component.laborHours.difficulty], 0
    ) / enhancedDiagnostic.affectedComponents.length;
    
    const difficulty = avgDifficulty >= 3.5 ? 'expert' : 
                     avgDifficulty >= 2.5 ? 'hard' : 
                     avgDifficulty >= 1.5 ? 'medium' : 'easy';

    // Create the diagnostic result
    const result: DiagnosticResult = {
      id: `manual-${Date.now()}`,
      issue: formData.issueTitle,
      severity: formData.severity,
      description: formData.symptoms,
      possibleCauses,
      recommendedActions,
      estimatedCost: formData.estimatedCost || enhancedDiagnostic.totalRepairCost.formattedRange,
      urgency: formData.urgency,
      consequences,
      affectedComponents,
      repairDetails: {
        laborHours: Math.round(enhancedDiagnostic.totalRepairCost.laborMin / 120),
        laborRate: 120,
        partsCost: `$${enhancedDiagnostic.totalRepairCost.partsMin} - $${enhancedDiagnostic.totalRepairCost.partsMax}`,
        totalCost: enhancedDiagnostic.totalRepairCost.formattedRange,
        difficulty
      },
      resources: {
        guides: enhancedDiagnostic.affectedComponents.map(comp => ({
          title: `${comp.component.name} Replacement Guide`,
          difficulty: comp.component.laborHours.difficulty,
          duration: `${comp.component.laborHours.min}-${comp.component.laborHours.max} hours`,
          rating: 4.5,
          url: '#'
        })),
        videos: enhancedDiagnostic.affectedComponents.map(comp => ({
          title: `How to Replace ${comp.component.name}`,
          channel: 'AutoRepair Pro',
          duration: '15:30',
          views: '250K',
          rating: 4.7,
          url: '#'
        })),
        documentation: enhancedDiagnostic.affectedComponents.map(comp => ({
          title: `${comp.component.name} Service Manual`,
          type: 'PDF',
          source: 'Manufacturer',
          url: '#'
        })),
        forumDiscussions: [],
        parts: enhancedDiagnostic.partsSources.map(source => ({
          name: enhancedDiagnostic.affectedComponents[0]?.component.name || 'Component',
          brand: source.type,
          price: source.priceRange,
          availability: source.availability,
          rating: 4.5,
          vendor: source.source,
          url: '#'
        }))
      },
      timestamp: Date.now(),
      vehicleInfo: {
        make: formData.vehicleMake,
        model: formData.vehicleModel,
        year: formData.vehicleYear.toString()
      },
      diagnosticType: 'manual',
      customName: formData.customName,
      notes: formData.notes,
      repairStatus: 'pending'
    };

    return [result];
  }

  /**
   * Save diagnostic to database
   */
  static async saveDiagnostic(formData: DiagnosticFormData): Promise<void> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }

      const userId = userData.user.id;

      // Generate diagnostic results to get the full data structure
      const suggestions = await this.getDiagnosticSuggestions(
        formData.symptoms,
        formData.vehicleMake,
        formData.vehicleModel,
        formData.vehicleYear
      );
      
      const diagnosticResults = this.generateDiagnosticResults(formData, suggestions);
      
      // Convert to database format
      const diagnosticIssue = convertDiagnosticResultToIssue(diagnosticResults[0], userId);
      
      // Prepare data for database insertion
      const diagnosticData = {
        user_id: userId,
        vehicle_make: formData.vehicleMake,
        vehicle_model: formData.vehicleModel,
        vehicle_year: formData.vehicleYear,
        symptoms: formData.symptoms,
        issue_title: formData.issueTitle,
        severity: formData.severity,
        urgency: formData.urgency,
        estimated_cost: formData.estimatedCost,
        diagnostic_type: 'manual',
        repair_status: 'pending',
        custom_name: formData.customName,
        notes: formData.notes, 
        possible_causes: diagnosticIssue.possible_causes,
        recommended_actions: diagnosticIssue.recommended_actions,
        diagnostic_data: diagnosticIssue.diagnostic_data,
        is_bookmarked: false
      };
      
      const { error } = await supabase
        .from('diagnostic_issues')
        .insert([diagnosticData]);
      
      if (error) {
        console.error('Error saving diagnostic:', error);
        throw new Error(`Failed to save diagnostic: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in saveDiagnostic:', error);
      throw error;
    }
  }

  /**
   * Get user's diagnostic history
   */
  static async getUserDiagnosticHistory(): Promise<DiagnosticResult[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      const { data, error } = await supabase
        .from('diagnostic_issues')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(25);
      
      if (error) {
        console.error('Error fetching diagnostic history:', error);
        throw new Error(`Failed to fetch diagnostic history: ${error.message}`);
      }
      
      // Convert database records to DiagnosticResult format
      return (data || []).map(issue => {
        return convertDiagnosticIssueToResult(issue);
      });
    } catch (error) {
      console.error('Error in getUserDiagnosticHistory:', error);
      throw error;
    }
  }

  /**
   * Update diagnostic issue
   */
  static async updateDiagnosticIssue(
    issueId: string,
    updates: {
      customName?: string;
      notes?: string;
      repairStatus?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      isBookmarked?: boolean;
      tags?: string[];
    }
  ): Promise<DiagnosticResult> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      const updateData: any = {};
      if (updates.customName !== undefined) updateData.custom_name = updates.customName;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.repairStatus !== undefined) updateData.repair_status = updates.repairStatus;
      if (updates.isBookmarked !== undefined) updateData.is_bookmarked = updates.isBookmarked;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      
      const { data, error } = await supabase
        .from('diagnostic_issues')
        .update(updateData)
        .eq('id', issueId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating diagnostic issue:', error);
        throw new Error(`Failed to update diagnostic: ${error.message}`);
      }
      
      return convertDiagnosticIssueToResult(data);
    } catch (error) {
      console.error('Error in updateDiagnosticIssue:', error);
      throw error;
    }
  }

  /**
   * Delete diagnostic issue
   */
  static async deleteDiagnosticIssue(issueId: string): Promise<void> {
    // Skip deletion for non-UUID IDs (like temporary IDs)
    if (!issueId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
      console.log('Skipping deletion for non-database ID:', issueId);
      return;
    }
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('User not authenticated');
      }
      
      const userId = userData.user.id;
      
      const { error } = await supabase
        .from('diagnostic_issues')
        .delete()
        .eq('id', issueId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error deleting diagnostic issue:', error);
        throw new Error(`Failed to delete diagnostic: ${error.message}`);
      } else {
        console.log('Successfully deleted diagnostic issue:', issueId);
      }
    } catch (error) {
      console.error('Error in deleteDiagnosticIssue:', error);
      throw error;
    }
  }
}