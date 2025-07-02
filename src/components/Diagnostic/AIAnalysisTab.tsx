import React from 'react';
import { 
  Brain, 
  Zap,
  Construction,
  Calendar
} from 'lucide-react';
import { geminiService, type GeminiDiagnosticRequest } from '../../services/geminiService';

interface AIAnalysisTabProps {
  formData: GeminiDiagnosticRequest;
  userId?: string;
}

const AIAnalysisTab: React.FC<AIAnalysisTabProps> = ({ formData: _formData, userId = 'anonymous' }) => {
  const _remainingRequests = geminiService.getRemainingRequests(userId);
  const _resetTime = geminiService.getResetTime(userId);

  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start">
          <Brain className="h-10 w-10 text-purple-600 mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-purple-900 text-2xl mb-3">AI Analysis Coming Soon!</h3>
            <p className="text-purple-800 text-lg mb-4">
              We're working hard to bring you advanced AI-powered diagnostic analysis powered by Google's Gemini AI.
              This feature will provide detailed insights, recommendations, and safety assessments based on your vehicle's symptoms.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
                <Construction className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-900 text-center mb-1">Advanced Analysis</h4>
                <p className="text-sm text-purple-700 text-center">Detailed diagnostic insights with confidence ratings</p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
                <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-900 text-center mb-1">Coming Soon!</h4>
                <p className="text-sm text-purple-700 text-center">Currently under development</p>
              </div>
              

            </div>
            
            <div className="bg-purple-100 rounded-lg p-4">
              <div className="flex items-start">
                <Zap className="h-5 w-5 text-purple-700 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-purple-900 mb-1">In the meantime...</h5>
                  <p className="text-purple-800 text-sm">
                    Our standard diagnostic system is fully functional and provides accurate results based on our extensive database of vehicle issues and solutions. Try it out by switching to the "Standard Diagnostics" tab.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisTab;