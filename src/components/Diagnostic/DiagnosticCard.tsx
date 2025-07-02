import React from 'react';
import { AlertTriangle, CheckCircle, Clock, ChevronRight, Wrench, DollarSign, Calendar, MapPin } from 'lucide-react';

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
  timestamp: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: string;
  };
  diagnosticType: 'manual' | 'obd';
}

interface DiagnosticCardProps {
  result: DiagnosticResult;
  onClick: (result: DiagnosticResult) => void;
  isSelected?: boolean;
}

const DiagnosticCard: React.FC<DiagnosticCardProps> = ({ result, onClick, isSelected = false }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      case 'medium':
        return <Clock className="h-5 w-5" />;
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return 'text-red-700 bg-red-50 border-red-200';
      case 'soon': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'moderate': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 ${
        isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent hover:border-primary-200'
      }`}
      onClick={() => onClick(result)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{result.issue}</h3>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(result.severity)}`}>
            {getSeverityIcon(result.severity)}
            <span className="ml-1 capitalize">{result.severity}</span>
          </span>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{result.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Possible Causes:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {result.possibleCauses.slice(0, 3).map((cause, index) => (
              <li key={index}>{cause}</li>
            ))}
            {result.possibleCauses.length > 3 && (
              <li className="text-primary-600 text-sm">+{result.possibleCauses.length - 3} more</li>
            )}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Recommended Actions:</h4>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {result.recommendedActions.slice(0, 3).map((action, index) => (
              <li key={index}>{action}</li>
            ))}
            {result.recommendedActions.length > 3 && (
              <li className="text-primary-600 text-sm">+{result.recommendedActions.length - 3} more</li>
            )}
          </ul>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
            <span className="font-semibold text-gray-900">{result.estimatedCost || result.repairDetails.totalCost}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(result.urgency)}`}>
            <Calendar className="h-3 w-3 inline mr-1" />
            {result.urgency === 'immediate' ? 'Fix Now' : 
             result.urgency === 'soon' ? 'Fix Soon' :
             result.urgency === 'moderate' ? 'Schedule Repair' : 'Monitor'}
          </div>
        </div>
        
        <div className="text-sm text-primary-600 font-medium">
          {result.possibleCauses.length > 0 ? 'View details →' : 'Click for details →'}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticCard;