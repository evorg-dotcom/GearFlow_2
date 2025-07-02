import React, { useState } from 'react';
import { Database, Brain, Zap } from 'lucide-react';
import DiagnosticCard from './DiagnosticCard';
import AIAnalysisTab from './AIAnalysisTab';
import InfoNotice from './InfoNotice';
import type { GeminiDiagnosticRequest } from '../../services/geminiService';

interface DiagnosticResult {
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

interface DiagnosticTabsProps {
  standardResults: DiagnosticResult[];
  formData: GeminiDiagnosticRequest;
  onSelectResult: (result: DiagnosticResult) => void;
  userId?: string;
}

const DiagnosticTabs: React.FC<DiagnosticTabsProps> = ({
  standardResults,
  formData,
  onSelectResult,
  userId
}) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'ai'>('standard');

  const tabs = [
    {
      id: 'standard',
      label: 'Standard Diagnostics',
      icon: Database,
      description: 'Database-powered diagnostic results'
    },
    {
      id: 'ai',
      label: 'AI Analysis',
      icon: Brain,
      description: 'AI-powered diagnostic insights',
      badge: 'Beta'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Information Notice */}
      <InfoNotice 
        message="For more accurate results, please provide specific details about your symptoms, including when they occur, any sounds or smells, and how the vehicle behaves. The more information you provide, the better our diagnostic system can match your issue."
      />
      
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'standard' | 'ai')}
                  className={`relative flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span className="mr-2">{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                  {tab.id === 'ai' && (
                    <Zap className="h-3 w-3 ml-1 text-purple-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Description */}
        <div className="px-6 py-3 bg-gray-50">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'standard' && (
          <div className="space-y-6">
            {standardResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Database Diagnostic Results
                  </h3>
                  <span className="text-sm text-gray-600">
                    {standardResults.length} result{standardResults.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {standardResults.map((result) => (
                    <DiagnosticCard
                      key={result.id}
                      result={result}
                      onClick={onSelectResult}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Standard Results</h3>
                <p className="text-gray-600 mb-6">
                  No matching diagnostic results found in our database for your symptoms.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> Try the AI Analysis tab for AI-powered diagnostic insights, 
                    or consider running an OBD-II scan for more specific diagnostic data.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <AIAnalysisTab formData={formData} userId={userId} />
        )}
      </div>
    </div>
  );
};

export default DiagnosticTabs;