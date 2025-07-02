import React, { useState } from 'react';
import { 
  ArrowLeft, AlertTriangle, Wrench, DollarSign, Clock, Users, 
  BookOpen, Video, FileText, MessageSquare, ShoppingCart, TrendingUp,
  Save, Share2, Calendar, MapPin, Star, ExternalLink, Download,
  CheckCircle, XCircle, AlertCircle, Info, Zap, Shield, Target
} from 'lucide-react';

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
}

interface DetailedDiagnosticProps {
  result: DiagnosticResult;
  onBack: () => void;
}

const DetailedDiagnostic: React.FC<DetailedDiagnosticProps> = ({ result, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'repair' | 'resources' | 'tracking'>('overview');
  const [savedResults, setSavedResults] = useState<string[]>([]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = () => {
    setSavedResults(prev => [...prev, result.id]);
    // In real app, this would save to backend/localStorage
  };

  const handleShare = () => {
    // In real app, this would open share dialog
    navigator.share?.({
      title: `Diagnostic Report: ${result.issue}`,
      text: result.description,
      url: window.location.href
    });
  };

  const handleExportPDF = () => {
    // In real app, this would generate and download PDF
    console.log('Exporting PDF for result:', result.id);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'components', label: 'Components', icon: Wrench },
    { id: 'repair', label: 'Repair Details', icon: DollarSign }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-primary-600 hover:text-primary-700 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Results</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{result.issue}</h1>
            <p className="text-lg text-gray-600 mb-2">{result.description}</p>
            {result.vehicleInfo && (
              <p className="text-sm text-gray-500">
                {result.vehicleInfo.year} {result.vehicleInfo.make} {result.vehicleInfo.model}
              </p>
            )}
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium border ${getSeverityColor(result.severity)}`}>
            <AlertTriangle className="h-6 w-6 mr-2" />
            {result.severity.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgency & Consequences */}
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 mr-2 text-orange-500" />
                Urgency & Impact
              </h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Repair Urgency</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.urgency === 'immediate' ? 'bg-red-100 text-red-800' :
                    result.urgency === 'soon' ? 'bg-orange-100 text-orange-800' :
                    result.urgency === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {result.urgency === 'immediate' ? 'Fix Immediately' :
                     result.urgency === 'soon' ? 'Fix Within Week' :
                     result.urgency === 'moderate' ? 'Schedule Soon' : 'Monitor Condition'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${
                    result.urgency === 'immediate' ? 'bg-red-500 w-full' :
                    result.urgency === 'soon' ? 'bg-orange-500 w-3/4' :
                    result.urgency === 'moderate' ? 'bg-yellow-500 w-1/2' :
                    'bg-green-500 w-1/4'
                  }`}></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Consequences if not addressed:</h4>
                <ul className="space-y-2">
                  {result.consequences.map((consequence, index) => (
                    <li key={index} className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{consequence}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-blue-500" />
                Recommended Next Steps
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Immediate Actions</h4>
                  <ul className="space-y-2">
                    {result.recommendedActions.slice(0, 2).map((action, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-800">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Diagnostic Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Diagnosis Complete</p>
                        <p className="text-sm text-gray-600">{new Date(result.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Recommended Repair Window</p>
                        <p className="text-sm text-gray-600">
                          {result.urgency === 'immediate' ? 'As soon as possible' :
                           result.urgency === 'soon' ? 'Within 1-2 weeks' :
                           result.urgency === 'moderate' ? 'Within 1 month' : 'At next service'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Wrench className="h-6 w-6 mr-2 text-primary-500" />
              Affected Components Analysis
            </h3>
            
            <div className="space-y-4">
              {result.affectedComponents.map((component, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">{component.name}</h4>
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(component.condition)}`}>
                          {component.condition.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">Priority: #{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Part Cost:</span>
                        <span className="font-medium text-gray-900">{component.replacementCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Labor Cost:</span>
                        <span className="font-medium text-gray-900">{component.laborCost || 'Included'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Cost:</span>
                        <span className="font-bold text-primary-600">{component.totalCost || component.replacementCost}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Likelihood:</span>
                        <span className="font-medium text-gray-900">{component.likelihood ? `${Math.round(component.likelihood)}%` : 'High'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Component condition indicator */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Component Condition</span>
                      <span className="text-gray-900">{component.condition}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${
                        component.condition === 'good' ? 'bg-green-500 w-full' :
                        component.condition === 'fair' ? 'bg-yellow-500 w-3/4' :
                        component.condition === 'poor' ? 'bg-orange-500 w-1/2' :
                        'bg-red-500 w-1/4'
                      }`}></div>
                    </div>
                  </div>
                  
                  {/* Quick action buttons */}
                  
                </div>
              ))}
            </div>
            
            {/* Cost Summary */}
            <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-semibold text-primary-900 mb-2">Total Estimated Repair Cost</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-primary-700">Parts:</span>
                  <div className="font-bold text-primary-900">{result.repairDetails.partsCost}</div>
                </div>
                <div>
                  <span className="text-primary-700">Labor:</span>
                  <div className="font-bold text-primary-900">${result.repairDetails.laborHours * result.repairDetails.laborRate}</div>
                </div>
                <div>
                  <span className="text-primary-700">Total:</span>
                  <div className="font-bold text-primary-900 text-lg">{result.repairDetails.totalCost}</div>
                </div>
                <div>
                  <span className="text-primary-700">Time:</span>
                  <div className="font-bold text-primary-900">{result.repairDetails.laborHours}+ hours</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'repair' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-primary-500" />
              Detailed Repair Information
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cost Breakdown */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Labor ({result.repairDetails.laborHours} hours @ ${result.repairDetails.laborRate}/hr)</span>
                    <span className="font-semibold text-gray-900">${(result.repairDetails.laborHours * result.repairDetails.laborRate).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Parts & Materials</span>
                    <span className="font-semibold text-gray-900">{result.repairDetails.partsCost}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg border border-primary-200">
                    <span className="text-primary-800 font-medium">Total Estimated Cost</span>
                    <span className="font-bold text-primary-900 text-lg">{result.repairDetails.totalCost}</span>
                  </div>
                </div>
              </div>

              {/* Repair Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Repair Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Difficulty Level:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(result.repairDetails.difficulty)}`}>
                      {result.repairDetails.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Estimated Time:</span>
                    <span className="font-medium text-gray-900">{result.repairDetails.laborHours} hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Recommended by:</span>
                    <span className="font-medium text-gray-900">ASE Certified Technicians</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-1">Important Note</h5>
                      <p className="text-yellow-700 text-sm">
                        Prices may vary by location and shop. Always get multiple quotes for major repairs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedDiagnostic;