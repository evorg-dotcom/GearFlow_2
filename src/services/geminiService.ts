import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiDiagnosticRequest {
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

export interface GeminiDiagnosticResponse {
  analysis: {
    primaryDiagnosis: string;
    confidence: number;
    reasoning: string;
  };
  possibleCauses: Array<{
    cause: string;
    probability: number;
    description: string;
  }>;
  recommendedActions: Array<{
    action: string;
    priority: 'immediate' | 'high' | 'medium' | 'low';
    description: string;
    estimatedCost?: string;
  }>;
  riskAssessment: {
    safetyRisk: 'low' | 'medium' | 'high' | 'critical';
    drivingRecommendation: string;
    timeframe: string;
  };
  additionalInsights: {
    preventiveMeasures: string[];
    relatedIssues: string[];
    maintenanceRecommendations: string[];
  };
  disclaimer: string;
}

export class GeminiDiagnosticService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized = false;
  private rateLimitTracker = new Map<string, { count: number; resetTime: number }>();
  private readonly MAX_REQUESTS_PER_HOUR = 10;
  private readonly RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('Gemini API key not found. AI analysis will be unavailable.');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  public isAvailable(): boolean {
    return this.isInitialized && this.model !== null;
  }

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimitTracker.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimitTracker.set(userId, { count: 1, resetTime: now + this.RATE_LIMIT_WINDOW });
      return true;
    }

    if (userLimit.count >= this.MAX_REQUESTS_PER_HOUR) {
      return false;
    }

    userLimit.count++;
    return true;
  }

  private createDiagnosticPrompt(request: GeminiDiagnosticRequest): string {
    return `
You are an expert automotive diagnostic AI assistant. Analyze the following vehicle issue and provide a comprehensive diagnostic assessment.

Vehicle Information:
- Make: ${request.vehicleMake}
- Model: ${request.vehicleModel}
- Year: ${request.vehicleYear}

Issue Details:
- Title: ${request.issueTitle}
- Symptoms: ${request.symptoms}
- Reported Severity: ${request.severity}
- Urgency: ${request.urgency}
${request.estimatedCost ? `- Estimated Cost: ${request.estimatedCost}` : ''}
${request.notes ? `- Additional Notes: ${request.notes}` : ''}

Please provide a structured analysis in the following JSON format:

{
  "analysis": {
    "primaryDiagnosis": "Most likely diagnosis based on symptoms",
    "confidence": 0.85,
    "reasoning": "Detailed explanation of why this is the most likely diagnosis"
  },
  "possibleCauses": [
    {
      "cause": "Specific component or system failure",
      "probability": 0.7,
      "description": "Detailed explanation of this potential cause"
    }
  ],
  "recommendedActions": [
    {
      "action": "Specific action to take",
      "priority": "immediate|high|medium|low",
      "description": "Why this action is recommended",
      "estimatedCost": "$100-$300 (optional)"
    }
  ],
  "riskAssessment": {
    "safetyRisk": "low|medium|high|critical",
    "drivingRecommendation": "Safe to drive / Drive with caution / Stop driving immediately",
    "timeframe": "How soon this needs attention"
  },
  "additionalInsights": {
    "preventiveMeasures": ["How to prevent this issue in the future"],
    "relatedIssues": ["Other issues that might be related"],
    "maintenanceRecommendations": ["Maintenance suggestions"]
  },
  "disclaimer": "This AI analysis is experimental and should be used as supplementary information only. Always consult a qualified mechanic for professional diagnosis."
}

Important guidelines:
1. Base your analysis on common automotive issues for the specified vehicle
2. Consider the vehicle's age and typical problems for that make/model/year
3. Provide realistic probability assessments
4. Include safety considerations
5. Be conservative with recommendations - when in doubt, recommend professional inspection
6. Include cost estimates when possible, but mark them as approximate
7. Always include the disclaimer about AI limitations

Respond with valid JSON only, no additional text.
`;
  }

  public async analyzeDiagnostic(
    request: GeminiDiagnosticRequest,
    userId: string = 'anonymous'
  ): Promise<GeminiDiagnosticResponse> {
    if (!this.isAvailable()) {
      throw new Error('Gemini AI service is not available. Please check your API configuration.');
    }

    if (!this.checkRateLimit(userId)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    try {
      const prompt = this.createDiagnosticPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      let parsedResponse: GeminiDiagnosticResponse;
      try {
        parsedResponse = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', text);
        throw new Error('Invalid response format from AI service');
      }

      // Validate the response structure
      this.validateResponse(parsedResponse);

      return parsedResponse;
    } catch (error) {
      console.error('Gemini API error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('limit')) {
          throw new Error('AI service quota exceeded. Please try again later.');
        }
        if (error.message.includes('API key')) {
          throw new Error('AI service authentication failed.');
        }
      }

      throw new Error('AI analysis failed. Please try again or use standard diagnostics.');
    }
  }

  private validateResponse(response: any): void {
    const requiredFields = [
      'analysis',
      'possibleCauses',
      'recommendedActions',
      'riskAssessment',
      'additionalInsights',
      'disclaimer'
    ];

    for (const field of requiredFields) {
      if (!response[field]) {
        throw new Error(`Invalid AI response: missing ${field}`);
      }
    }

    // Validate analysis object
    if (!response.analysis.primaryDiagnosis || 
        typeof response.analysis.confidence !== 'number' ||
        !response.analysis.reasoning) {
      throw new Error('Invalid AI response: malformed analysis');
    }

    // Validate arrays
    if (!Array.isArray(response.possibleCauses) || 
        !Array.isArray(response.recommendedActions)) {
      throw new Error('Invalid AI response: malformed arrays');
    }
  }

  public getRemainingRequests(userId: string): number {
    const userLimit = this.rateLimitTracker.get(userId);
    if (!userLimit || Date.now() > userLimit.resetTime) {
      return this.MAX_REQUESTS_PER_HOUR;
    }
    return Math.max(0, this.MAX_REQUESTS_PER_HOUR - userLimit.count);
  }

  public getResetTime(userId: string): Date | null {
    const userLimit = this.rateLimitTracker.get(userId);
    if (!userLimit || Date.now() > userLimit.resetTime) {
      return null;
    }
    return new Date(userLimit.resetTime);
  }
}

export const geminiService = new GeminiDiagnosticService();