import { ComponentMatcher, type ComponentData } from '../data/componentDatabase';
import type { DiagnosticFormData } from './diagnosticService';

export interface EnhancedDiagnosticResult {
  id: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedComponents: {
    component: ComponentData;
    condition: 'good' | 'fair' | 'poor' | 'critical';
    replacementCost: string;
    laborCost: string;
    totalCost: string;
    priority: number;
    likelihood: number; // 0-100%
  }[];
  totalRepairCost: {
    partsMin: number;
    partsMax: number;
    laborMin: number;
    laborMax: number;
    totalMin: number;
    totalMax: number;
    formattedRange: string;
  };
  diagnosticSteps: string[];
  preventiveMeasures: string[];
  urgencyLevel: 'immediate' | 'soon' | 'moderate' | 'low';
  safetyRisk: 'low' | 'medium' | 'high' | 'critical';
  estimatedRepairTime: string;
  recommendedShops: string[];
  partsSources: Array<{
    source: string;
    type: 'OEM' | 'Aftermarket';
    priceRange: string;
    availability: string;
  }>;
}

export class EnhancedDiagnosticService {
  private static readonly LABOR_RATE = 120; // Standard labor rate per hour

  static generateEnhancedDiagnostic(formData: DiagnosticFormData): EnhancedDiagnosticResult {
    // Extract symptoms and keywords from user input
    const symptoms = this.extractSymptoms(formData.symptoms);
    const keywords = this.extractKeywords(formData.symptoms);
    
    // Find matching components based on symptoms
    let matchingComponents = ComponentMatcher.findComponentsBySymptoms([...symptoms, ...keywords]);
    
    // Filter by vehicle make if available
    if (formData.vehicleMake) {
      const makeComponents = ComponentMatcher.findComponentsByMake(formData.vehicleMake);
      matchingComponents = matchingComponents.filter(comp => 
        makeComponents.some(makeComp => makeComp.id === comp.id)
      );
    }

    // If no specific matches, use broader search
    if (matchingComponents.length === 0) {
      matchingComponents = ComponentMatcher.searchComponents(formData.symptoms);
    }

    // Limit to top 5 most relevant components
    matchingComponents = matchingComponents.slice(0, 5);

    // Generate affected components with detailed analysis
    const affectedComponents = matchingComponents.map((component, index) => {
      const likelihood = this.calculateLikelihood(component, symptoms, keywords);
      const condition = this.determineCondition(formData.severity, likelihood);
      const priority = index + 1;

      const partsCost = this.getPartsCostForCondition(component, condition);
      const laborCost = component.laborHours.min * this.LABOR_RATE;
      const totalCost = partsCost + laborCost;

      return {
        component,
        condition,
        replacementCost: `$${partsCost}`,
        laborCost: `$${laborCost}`,
        totalCost: `$${totalCost}`,
        priority,
        likelihood
      };
    });

    // Calculate total repair costs
    const totalRepairCost = this.calculateTotalCosts(affectedComponents);

    // Generate diagnostic steps
    const diagnosticSteps = this.generateDiagnosticSteps(affectedComponents);

    // Generate preventive measures
    const preventiveMeasures = this.generatePreventiveMeasures(affectedComponents);

    // Determine urgency and safety risk
    const urgencyLevel = this.determineUrgency(formData.severity, affectedComponents);
    const safetyRisk = this.determineSafetyRisk(affectedComponents);

    // Estimate repair time
    const estimatedRepairTime = this.estimateRepairTime(affectedComponents);

    // Generate parts sources
    const partsSources = this.generatePartsSources(affectedComponents);

    return {
      id: `enhanced-${Date.now()}`,
      issue: formData.issueTitle,
      severity: formData.severity,
      description: formData.symptoms,
      affectedComponents,
      totalRepairCost,
      diagnosticSteps,
      preventiveMeasures,
      urgencyLevel,
      safetyRisk,
      estimatedRepairTime,
      recommendedShops: [
        'Certified ASE Mechanics',
        'Dealership Service Centers',
        'Specialized Auto Repair Shops'
      ],
      partsSources
    };
  }

  private static extractSymptoms(description: string): string[] {
    const commonSymptoms = [
      'rough idle', 'poor acceleration', 'engine misfire', 'check engine light',
      'grinding noise', 'squealing', 'vibration', 'overheating', 'stalling',
      'hard starting', 'poor fuel economy', 'smoke', 'leaking', 'burning smell',
      'whining noise', 'clicking', 'hesitation', 'loss of power', 'jerking'
    ];

    const normalizedDescription = description.toLowerCase();
    return commonSymptoms.filter(symptom => 
      normalizedDescription.includes(symptom)
    );
  }

  private static extractKeywords(description: string): string[] {
    const keywords = description.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['when', 'that', 'this', 'with', 'from', 'have', 'been', 'will', 'would'].includes(word));

    return [...new Set(keywords)];
  }

  private static calculateLikelihood(component: ComponentData, symptoms: string[], keywords: string[]): number {
    let score = 0;
    const maxScore = 100;

    // Check symptom matches
    const symptomMatches = component.symptoms.filter(symptom =>
      symptoms.some(userSymptom => 
        userSymptom.includes(symptom) || symptom.includes(userSymptom)
      )
    );
    score += (symptomMatches.length / component.symptoms.length) * 60;

    // Check keyword matches in description and failure reasons
    const allComponentText = [
      component.name,
      component.description,
      ...component.commonFailureReasons
    ].join(' ').toLowerCase();

    const keywordMatches = keywords.filter(keyword => 
      allComponentText.includes(keyword)
    );
    score += (keywordMatches.length / Math.max(keywords.length, 1)) * 40;

    return Math.min(score, maxScore);
  }

  private static determineCondition(severity: string, likelihood: number): 'good' | 'fair' | 'poor' | 'critical' {
    if (severity === 'critical' || likelihood > 80) return 'critical';
    if (severity === 'high' || likelihood > 60) return 'poor';
    if (severity === 'medium' || likelihood > 40) return 'fair';
    return 'good';
  }

  private static getPartsCostForCondition(component: ComponentData, condition: string): number {
    switch (condition) {
      case 'critical':
        return component.priceRange.oem;
      case 'poor':
        return Math.round((component.priceRange.oem + component.priceRange.aftermarket) / 2);
      case 'fair':
        return component.priceRange.aftermarket;
      default:
        return component.priceRange.min;
    }
  }

  private static calculateTotalCosts(affectedComponents: any[]): any {
    const partsMin = affectedComponents.reduce((sum, comp) => 
      sum + comp.component.priceRange.min, 0
    );
    const partsMax = affectedComponents.reduce((sum, comp) => 
      sum + comp.component.priceRange.max, 0
    );
    const laborMin = affectedComponents.reduce((sum, comp) => 
      sum + (comp.component.laborHours.min * this.LABOR_RATE), 0
    );
    const laborMax = affectedComponents.reduce((sum, comp) => 
      sum + (comp.component.laborHours.max * this.LABOR_RATE), 0
    );

    const totalMin = partsMin + laborMin;
    const totalMax = partsMax + laborMax;

    return {
      partsMin,
      partsMax,
      laborMin,
      laborMax,
      totalMin,
      totalMax,
      formattedRange: `$${totalMin} - $${totalMax}`
    };
  }

  private static generateDiagnosticSteps(affectedComponents: any[]): string[] {
    const steps = [
      'Perform initial visual inspection of engine bay and undercarriage',
      'Connect OBD-II scanner to retrieve diagnostic trouble codes',
      'Check all fluid levels and condition'
    ];

    affectedComponents.forEach(comp => {
      const component = comp.component;
      
      if (component.category === 'engine') {
        steps.push(`Test ${component.name} operation and electrical connections`);
      } else if (component.category === 'brakes') {
        steps.push(`Inspect ${component.name} for wear and proper operation`);
      } else if (component.category === 'electrical') {
        steps.push(`Test ${component.name} voltage and amperage output`);
      } else {
        steps.push(`Inspect and test ${component.name} functionality`);
      }
    });

    steps.push('Verify repair by test driving and re-scanning for codes');
    
    return steps;
  }

  private static generatePreventiveMeasures(affectedComponents: any[]): string[] {
    const measures = new Set<string>();

    affectedComponents.forEach(comp => {
      const component = comp.component;
      
      if (component.category === 'engine') {
        measures.add('Follow regular oil change intervals');
        measures.add('Use quality fuel and fuel additives');
        measures.add('Replace air filter regularly');
      } else if (component.category === 'brakes') {
        measures.add('Avoid aggressive braking when possible');
        measures.add('Have brakes inspected every 12,000 miles');
      } else if (component.category === 'cooling') {
        measures.add('Flush cooling system per manufacturer schedule');
        measures.add('Check coolant levels monthly');
      } else if (component.category === 'electrical') {
        measures.add('Keep battery terminals clean and tight');
        measures.add('Test charging system annually');
      }
    });

    measures.add('Follow manufacturer maintenance schedule');
    measures.add('Address warning lights promptly');

    return Array.from(measures);
  }

  private static determineUrgency(severity: string, affectedComponents: any[]): 'immediate' | 'soon' | 'moderate' | 'low' {
    const hasCriticalComponent = affectedComponents.some(comp => 
      comp.component.warningLevel === 'critical'
    );

    if (severity === 'critical' || hasCriticalComponent) return 'immediate';
    if (severity === 'high') return 'soon';
    if (severity === 'medium') return 'moderate';
    return 'low';
  }

  private static determineSafetyRisk(affectedComponents: any[]): 'low' | 'medium' | 'high' | 'critical' {
    const maxRisk = affectedComponents.reduce((max, comp) => {
      const riskLevels = { low: 1, medium: 2, high: 3, critical: 4 };
      const componentRisk = riskLevels[comp.component.warningLevel];
      return Math.max(max, componentRisk);
    }, 1);

    const riskMap = { 1: 'low', 2: 'medium', 3: 'high', 4: 'critical' };
    return riskMap[maxRisk] as 'low' | 'medium' | 'high' | 'critical';
  }

  private static estimateRepairTime(affectedComponents: any[]): string {
    const totalHours = affectedComponents.reduce((sum, comp) => 
      sum + comp.component.laborHours.max, 0
    );

    if (totalHours <= 2) return '1-2 hours';
    if (totalHours <= 4) return '2-4 hours';
    if (totalHours <= 8) return '4-8 hours (same day)';
    return '1-2 days';
  }

  private static generatePartsSources(affectedComponents: any[]): Array<{
    source: string;
    type: 'OEM' | 'Aftermarket';
    priceRange: string;
    availability: string;
  }> {
    return [
      {
        source: 'Dealership Parts Department',
        type: 'OEM',
        priceRange: 'Highest quality, premium pricing',
        availability: '1-3 business days'
      },
      {
        source: 'AutoZone / O\'Reilly Auto Parts',
        type: 'Aftermarket',
        priceRange: 'Mid-range pricing, good quality',
        availability: 'Same day / Next day'
      },
      {
        source: 'RockAuto.com',
        type: 'Aftermarket',
        priceRange: 'Competitive pricing, wide selection',
        availability: '2-5 business days'
      },
      {
        source: 'Amazon Automotive',
        type: 'Aftermarket',
        priceRange: 'Variable pricing, fast shipping',
        availability: '1-2 business days'
      }
    ];
  }
}