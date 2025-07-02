import React, { useState, useEffect } from 'react';
import { Search, Car, AlertTriangle, CheckCircle, Clock, Bluetooth, History, Loader } from 'lucide-react';
import DiagnosticTabs from '../components/Diagnostic/DiagnosticTabs';
import DetailedDiagnostic from '../components/Diagnostic/DetailedDiagnostic';
import DiagnosticHistory from '../components/Diagnostic/DiagnosticHistory';
import { DiagnosticService } from '../services/diagnosticService';
import type { ValidationError, DiagnosticFormData } from '../services/diagnosticService';
import type { GeminiDiagnosticRequest } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';

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
  // Enhanced fields for accessibility
  customName?: string;
  tags?: string[];
  notes?: string;
  isBookmarked?: boolean;
  repairStatus?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

interface OBDData {
  engineRPM?: number;
  vehicleSpeed?: number;
  engineLoad?: number;
  coolantTemp?: number;
  intakeTemp?: number;
  fuelPressure?: number;
  throttlePosition?: number;
  oxygenSensor?: number;
  fuelTrim?: number;
  diagnosticTroubleCodes: string[];
  readinessMonitors: {
    [key: string]: 'ready' | 'not_ready' | 'not_applicable';
  };
}

const Diagnostic: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Form state
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [issueTitle, setIssueTitle] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [urgency, setUrgency] = useState<'immediate' | 'soon' | 'moderate' | 'low'>('moderate');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [customName, setCustomName] = useState('');
  const [notes, setNotes] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<ValidationError[]>([]);
  const [apiError, setApiError] = useState<string>('');
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<DiagnosticResult | null>(null);
  const [diagnosticMode, setDiagnosticMode] = useState<'manual' | 'obd' | 'history'>('manual');
  const [obdData, setObdData] = useState<OBDData | null>(null);
  const [diagnosticHistory, setDiagnosticHistory] = useState<DiagnosticResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [newDiagnosticsCount, setNewDiagnosticsCount] = useState(0);
  const [lastViewedHistoryTime, setLastViewedHistoryTime] = useState(Date.now());
  const [hasUnviewedDiagnostics, setHasUnviewedDiagnostics] = useState(false);

  // Handle diagnostic result deletion
  const handleDiagnosticUpdate = async (updatedResult: DiagnosticResult) => {
    // Handle regular updates
    setDiagnosticHistory(prev => 
      prev.map(result => 
        result.id === updatedResult.id ? updatedResult : result
      )
    );
    
    // Also update in database if it's a real database record (has UUID format)
    if (updatedResult.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
      try {
        await DiagnosticService.updateDiagnosticIssue(
          updatedResult.id,
          {
            customName: updatedResult.customName,
            notes: updatedResult.notes,
            repairStatus: updatedResult.repairStatus,
            isBookmarked: updatedResult.isBookmarked,
            tags: updatedResult.tags
          },
          currentUser?.id || ''
        );
      } catch (error) {
        console.error('Failed to update diagnostic in database:', error);
      }
    }
  };

  // Track new diagnostics for notification
  useEffect(() => {
    const newCount = diagnosticHistory.filter(diagnostic => 
      diagnostic.timestamp > lastViewedHistoryTime
    ).length;
    setNewDiagnosticsCount(newCount);
    setHasUnviewedDiagnostics(newCount > 0);
  }, [diagnosticHistory, lastViewedHistoryTime]);

  // Load diagnostic history when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      loadDiagnosticHistory();
    }
  }, [currentUser]);

  // Load diagnostic history from database
  const loadDiagnosticHistory = async () => {
    if (!currentUser) return;
    
    setHistoryLoading(true);
    try {
      const history = await DiagnosticService.getUserDiagnosticHistory();
      setDiagnosticHistory(history);
    } catch (error) {
      console.error('Failed to load diagnostic history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Clear badges when switching away from history mode
  const handleModeChange = (newMode: 'manual' | 'obd' | 'history') => {
    if (newMode !== 'history' && diagnosticMode === 'history') {
      // User is leaving history mode - clear all badges
      setLastViewedHistoryTime(Date.now());
      setNewDiagnosticsCount(0);
      setHasUnviewedDiagnostics(false);
    }
    setDiagnosticMode(newMode);
    
    // Clear any existing results and errors when switching modes
    setResults([]);
    setApiError('');
    setFormErrors([]);
  };

  // Main diagnostic function that calls the backend
  const runDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setApiError('Please log in to run diagnostics');
      return;
    }
    
    // Clear previous errors
    setFormErrors([]);
    setApiError('');
    setLoading(true);
    
    try {
      // Prepare form data
      const formData: DiagnosticFormData = {
        vehicleMake: make.trim(),
        vehicleModel: model.trim(),
        vehicleYear: parseInt(year),
        symptoms: symptoms.trim(),
        issueTitle: issueTitle.trim() || `${make} ${model} Issue`,
        severity,
        urgency,
        estimatedCost: estimatedCost.trim() || undefined,
        customName: customName.trim() || undefined,
        notes: notes.trim() || undefined
      };
      
      // Validate form data
      const validationErrors = DiagnosticService.validateFormData(formData);
      if (validationErrors.length > 0) {
        setFormErrors(validationErrors);
        setLoading(false);
        return;
      }
      
      // Get diagnostic suggestions from backend
      const suggestions = await DiagnosticService.getDiagnosticSuggestions(
        formData.symptoms,
        formData.vehicleMake,
        formData.vehicleModel,
        formData.vehicleYear
      );
      
      // Generate diagnostic results based on suggestions
      const diagnosticResults = DiagnosticService.generateDiagnosticResults(formData, suggestions);
      
      // Prepare data for AI analysis
      const aiFormData: GeminiDiagnosticRequest = {
        vehicleMake: formData.vehicleMake,
        vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear,
        symptoms: formData.symptoms,
        issueTitle: formData.issueTitle,
        severity: formData.severity,
        urgency: formData.urgency,
        estimatedCost: formData.estimatedCost,
        customName: formData.customName,
        notes: formData.notes
      };
      
      // Save the diagnostic to database
      try {
        await DiagnosticService.saveDiagnostic(formData);
        // Reload history after saving
        await loadDiagnosticHistory();
      } catch (saveError) {
        console.warn('Failed to save diagnostic to database:', saveError);
        // Continue with results even if save fails
      }
      
      setResults(diagnosticResults);
      
      // Add to history
      setDiagnosticHistory(prev => [...diagnosticResults, ...prev]);
      
    } catch (error: any) {
      console.error('Diagnostic error:', error);
      setApiError(error.message || 'Failed to run diagnostic. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOBDData = (data: OBDData) => {
    setObdData(data);
    
    // Generate diagnostic results based on OBD data
    const obdResults: DiagnosticResult[] = [];
    
    if (data.diagnosticTroubleCodes.length > 0) {
      data.diagnosticTroubleCodes.forEach(code => {
        if (code === 'P0171') {
          obdResults.push({
            id: `obd-${Date.now()}-${code}`,
            issue: 'System Too Lean (Bank 1)',
            severity: 'medium',
            description: 'The engine is running too lean, which can cause poor performance and potential engine damage.',
            possibleCauses: ['Vacuum leak', 'Faulty MAF sensor', 'Clogged fuel injectors', 'Weak fuel pump', 'Dirty air filter'],
            recommendedActions: ['Check for vacuum leaks', 'Clean MAF sensor', 'Test fuel pressure', 'Inspect fuel injectors'],
            estimatedCost: '$100 - $500',
            urgency: 'soon',
            consequences: [
              'Poor fuel economy',
              'Rough idle',
              'Potential engine damage',
              'Failed emissions test'
            ],
            affectedComponents: [
              { name: 'MAF Sensor', condition: 'fair', replacementCost: '$150 - $300' },
              { name: 'Fuel Injectors', condition: 'fair', replacementCost: '$200 - $400' },
              { name: 'Vacuum Lines', condition: 'poor', replacementCost: '$50 - $150' }
            ],
            repairDetails: {
              laborHours: 2,
              laborRate: 120,
              partsCost: '$50 - $300',
              totalCost: '$290 - $540',
              difficulty: 'medium'
            },
            resources: {
              guides: [
                { title: 'P0171 Code Diagnosis Guide', difficulty: 'medium', duration: '45 min', rating: 4.7, url: '#' },
                { title: 'Vacuum Leak Detection', difficulty: 'medium', duration: '30 min', rating: 4.5, url: '#' }
              ],
              videos: [
                { title: 'How to Fix P0171 Code', channel: 'ScannerDanner', duration: '18:45', views: '950K', rating: 4.8, url: '#' },
                { title: 'MAF Sensor Cleaning', channel: 'ChrisFix', duration: '12:30', views: '2.3M', rating: 4.9, url: '#' }
              ],
              documentation: [
                { title: 'P0171 Technical Service Bulletin', type: 'TSB', source: 'Manufacturer', url: '#' },
                { title: 'Fuel System Diagram', type: 'Diagram', source: 'Service Manual', url: '#' }
              ],
              forumDiscussions: [
                { title: 'P0171 - Finally solved!', replies: 34, solved: true, lastActivity: '1 day ago', url: '#' },
                { title: 'Lean condition troubleshooting', replies: 28, solved: false, lastActivity: '4 days ago', url: '#' }
              ],
              parts: [
                { name: 'Bosch MAF Sensor', brand: 'Bosch', price: '$189.99', availability: 'In Stock', rating: 4.6, vendor: 'FCP Euro', url: '#' },
                { name: 'Vacuum Line Kit', brand: 'Dorman', price: '$45.99', availability: 'In Stock', rating: 4.4, vendor: 'AutoZone', url: '#' },
                { name: 'Fuel Injector Cleaner', brand: 'Lucas', price: '$12.99', availability: 'In Stock', rating: 4.7, vendor: 'O\'Reilly', url: '#' }
              ]
            },
            timestamp: Date.now(),
            diagnosticType: 'obd',
            repairStatus: 'pending'
          });
        }
        if (code === 'P0300') {
          obdResults.push({
            id: `obd-${Date.now()}-${code}`,
            issue: 'Random/Multiple Cylinder Misfire',
            severity: 'high',
            description: 'Multiple cylinders are misfiring, causing rough idle and reduced performance.',
            possibleCauses: ['Faulty spark plugs', 'Ignition coil failure', 'Fuel system issues', 'Engine timing problems'],
            recommendedActions: ['Replace spark plugs', 'Test ignition coils', 'Check fuel pressure', 'Verify engine timing'],
            estimatedCost: '$200 - $800',
            urgency: 'soon',
            consequences: [
              'Severe performance loss',
              'Catalytic converter damage',
              'Engine damage if continued',
              'Failed emissions test'
            ],
            affectedComponents: [
              { name: 'Spark Plugs', condition: 'critical', replacementCost: '$80 - $120' },
              { name: 'Ignition Coils', condition: 'poor', replacementCost: '$150 - $300' },
              { name: 'Fuel System', condition: 'fair', replacementCost: '$200 - $500' }
            ],
            repairDetails: {
              laborHours: 3,
              laborRate: 120,
              partsCost: '$100 - $400',
              totalCost: '$460 - $760',
              difficulty: 'medium'
            },
            resources: {
              guides: [
                { title: 'P0300 Multiple Misfire Diagnosis', difficulty: 'medium', duration: '60 min', rating: 4.8, url: '#' },
                { title: 'Ignition System Testing', difficulty: 'hard', duration: '45 min', rating: 4.6, url: '#' }
              ],
              videos: [
                { title: 'Multiple Cylinder Misfire Fix', channel: 'ScannerDanner', duration: '22:15', views: '1.2M', rating: 4.9, url: '#' },
                { title: 'Ignition Coil Testing', channel: 'ChrisFix', duration: '16:30', views: '1.8M', rating: 4.7, url: '#' }
              ],
              documentation: [
                { title: 'P0300 Diagnostic Procedures', type: 'TSB', source: 'Manufacturer', url: '#' },
                { title: 'Ignition System Wiring', type: 'Diagram', source: 'Service Manual', url: '#' }
              ],
              forumDiscussions: [
                { title: 'P0300 solved after months!', replies: 45, solved: true, lastActivity: '3 hours ago', url: '#' },
                { title: 'Multiple misfire troubleshooting', replies: 32, solved: false, lastActivity: '2 days ago', url: '#' }
              ],
              parts: [
                { name: 'NGK Iridium Spark Plugs', brand: 'NGK', price: '$45.99', availability: 'In Stock', rating: 4.8, vendor: 'AutoZone', url: '#' },
                { name: 'Delphi Ignition Coil Pack', brand: 'Delphi', price: '$189.99', availability: 'In Stock', rating: 4.7, vendor: 'RockAuto', url: '#' },
                { name: 'Fuel System Cleaner', brand: 'Techron', price: '$15.99', availability: 'In Stock', rating: 4.6, vendor: 'Walmart', url: '#' }
              ]
            },
            timestamp: Date.now(),
            diagnosticType: 'obd',
            repairStatus: 'pending'
          });
        }
      });
    }

    // Check for abnormal readings
    if (data.coolantTemp && data.coolantTemp > 110) {
      obdResults.push({
        id: `obd-${Date.now()}-overheating`,
        issue: 'Engine Overheating',
        severity: 'critical',
        description: 'Engine coolant temperature is above normal operating range.',
        possibleCauses: ['Low coolant level', 'Faulty thermostat', 'Radiator blockage', 'Water pump failure'],
        recommendedActions: ['Check coolant level', 'Inspect thermostat', 'Flush cooling system', 'Test water pump'],
        estimatedCost: '$50 - $600',
        urgency: 'immediate',
        consequences: [
          'Engine seizure',
          'Head gasket failure',
          'Warped cylinder head',
          'Complete engine replacement needed'
        ],
        affectedComponents: [
          { name: 'Thermostat', condition: 'poor', replacementCost: '$50 - $150' },
          { name: 'Water Pump', condition: 'critical', replacementCost: '$300 - $500' },
          { name: 'Radiator', condition: 'fair', replacementCost: '$200 - $400' }
        ],
        repairDetails: {
          laborHours: 3,
          laborRate: 120,
          partsCost: '$100 - $500',
          totalCost: '$460 - $860',
          difficulty: 'hard'
        },
        resources: {
          guides: [
            { title: 'Engine Overheating Diagnosis', difficulty: 'medium', duration: '60 min', rating: 4.8, url: '#' },
            { title: 'Cooling System Repair Guide', difficulty: 'hard', duration: '90 min', rating: 4.6, url: '#' }
          ],
          videos: [
            { title: 'Why Engines Overheat', channel: 'Engineering Explained', duration: '14:20', views: '1.5M', rating: 4.9, url: '#' },
            { title: 'Thermostat Replacement', channel: 'ChrisFix', duration: '16:45', views: '2.8M', rating: 4.8, url: '#' }
          ],
          documentation: [
            { title: 'Cooling System Specifications', type: 'Manual', source: 'Service Manual', url: '#' },
            { title: 'Overheating Troubleshooting Chart', type: 'Guide', source: 'Manufacturer', url: '#' }
          ],
          forumDiscussions: [
            { title: 'Overheating issue resolved', replies: 56, solved: true, lastActivity: '2 hours ago', url: '#' },
            { title: 'Thermostat vs water pump?', replies: 23, solved: false, lastActivity: '1 day ago', url: '#' }
          ],
          parts: [
            { name: 'OEM Thermostat', brand: 'Genuine', price: '$45.99', availability: 'In Stock', rating: 4.8, vendor: 'Dealer', url: '#' },
            { name: 'Gates Water Pump', brand: 'Gates', price: '$189.99', availability: 'In Stock', rating: 4.7, vendor: 'RockAuto', url: '#' },
            { name: 'Mishimoto Radiator', brand: 'Mishimoto', price: '$299.99', availability: 'Limited', rating: 4.9, vendor: 'Summit Racing', url: '#' }
          ]
        },
        timestamp: Date.now(),
        diagnosticType: 'obd',
        repairStatus: 'pending'
      });
    }

    if (data.engineLoad && data.engineLoad > 85) {
      obdResults.push({
        id: `obd-${Date.now()}-high-load`,
        issue: 'High Engine Load',
        severity: 'medium',
        description: 'Engine is operating under higher than normal load conditions.',
        possibleCauses: ['Clogged air filter', 'Exhaust restriction', 'Engine carbon buildup', 'Transmission issues'],
        recommendedActions: ['Replace air filter', 'Check exhaust system', 'Consider engine cleaning', 'Inspect transmission'],
        estimatedCost: '$50 - $400',
        urgency: 'moderate',
        consequences: [
          'Reduced fuel economy',
          'Increased emissions',
          'Premature engine wear',
          'Potential overheating'
        ],
        affectedComponents: [
          { name: 'Air Filter', condition: 'poor', replacementCost: '$15 - $35' },
          { name: 'Exhaust System', condition: 'fair', replacementCost: '$200 - $600' },
          { name: 'Engine Internals', condition: 'fair', replacementCost: '$500 - $2000' }
        ],
        repairDetails: {
          laborHours: 1.5,
          laborRate: 120,
          partsCost: '$25 - $200',
          totalCost: '$205 - $380',
          difficulty: 'easy'
        },
        resources: {
          guides: [
            { title: 'High Engine Load Diagnosis', difficulty: 'medium', duration: '30 min', rating: 4.5, url: '#' },
            { title: 'Air Filter Maintenance', difficulty: 'easy', duration: '15 min', rating: 4.8, url: '#' }
          ],
          videos: [
            { title: 'Engine Load Explained', channel: 'Engineering Explained', duration: '12:30', views: '800K', rating: 4.7, url: '#' },
            { title: 'Air Filter Replacement', channel: 'ChrisFix', duration: '8:15', views: '1.1M', rating: 4.8, url: '#' }
          ],
          documentation: [
            { title: 'Engine Load Specifications', type: 'Manual', source: 'Service Manual', url: '#' },
            { title: 'Performance Troubleshooting', type: 'Guide', source: 'Manufacturer', url: '#' }
          ],
          forumDiscussions: [
            { title: 'High engine load fixed', replies: 18, solved: true, lastActivity: '1 day ago', url: '#' },
            { title: 'Engine performance issues', replies: 25, solved: false, lastActivity: '3 days ago', url: '#' }
          ],
          parts: [
            { name: 'K&N Air Filter', brand: 'K&N', price: '$35.99', availability: 'In Stock', rating: 4.7, vendor: 'Amazon', url: '#' },
            { name: 'OEM Air Filter', brand: 'Genuine', price: '$18.99', availability: 'In Stock', rating: 4.5, vendor: 'Dealer', url: '#' },
            { name: 'Engine Cleaner', brand: 'Sea Foam', price: '$12.99', availability: 'In Stock', rating: 4.6, vendor: 'AutoZone', url: '#' }
          ]
        },
        timestamp: Date.now(),
        diagnosticType: 'obd',
        repairStatus: 'pending'
      });
    }

    setResults(obdResults);
    
    // Add to history
    if (obdResults.length > 0) {
      setDiagnosticHistory(prev => [...obdResults, ...prev]);
    }
  };

  const handleResultClick = (result: DiagnosticResult) => {
    setSelectedResult(result);
  };

  const handleBackToResults = () => {
    setSelectedResult(null);
  };

  const handleUpdateResult = (updatedResult: DiagnosticResult) => {
    setDiagnosticHistory(prev => 
      prev.map(result => 
        result.id === updatedResult.id ? updatedResult : result
      )
    );
    
    // Also update in database if it's a real database record (has UUID format)
    if (updatedResult.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
      try {
        DiagnosticService.updateDiagnosticIssue(
          updatedResult.id,
          {
            customName: updatedResult.customName,
            notes: updatedResult.notes,
            repairStatus: updatedResult.repairStatus,
            isBookmarked: updatedResult.isBookmarked,
            tags: updatedResult.tags
          },
          currentUser?.id || ''
        );
      } catch (error) {
        console.error('Failed to update diagnostic in database:', error);
      }
    }
  };
  
  // Helper function to get field error
  const getFieldError = (fieldName: string): string | undefined => {
    const error = formErrors.find(err => err.field === fieldName);
    return error?.message;
  };
  
  // Helper function to check if field has error
  const hasFieldError = (fieldName: string): boolean => {
    return formErrors.some(err => err.field === fieldName);
  };

  // If a result is selected, show detailed view
  if (selectedResult) {
    return <DetailedDiagnostic result={selectedResult} onBack={handleBackToResults} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Car Diagnostic Tool</h1>
        <p className="text-lg text-gray-600">
          Choose between manual symptom entry or view diagnostic history
        </p>
      </div>

      {/* Diagnostic Mode Selector */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={() => handleModeChange('manual')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              diagnosticMode === 'manual'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Search className="h-5 w-5 mr-2" />
            Manual Diagnostic
          </button>
          <button
            onClick={() => handleModeChange('obd')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              diagnosticMode === 'obd'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bluetooth className="h-5 w-5 mr-2" />
            OBD-II Scanner
          </button>
          <button
            onClick={() => handleModeChange('history')}
            className={`relative flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              diagnosticMode === 'history'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <History className="h-5 w-5 mr-2" />
            Diagnostic History
            {newDiagnosticsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center min-w-[1.5rem] animate-pulse">
                {newDiagnosticsCount > 99 ? '99+' : newDiagnosticsCount}
              </span>
            )}
          </button>
        </div>

        {diagnosticMode === 'manual' ? (
          <form onSubmit={runDiagnosis} className="space-y-6">
            {/* API Error Display */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                  <p className="text-red-800">{apiError}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
                  Make *
                </label>
                <input
                  type="text"
                  id="make"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    hasFieldError('vehicleMake') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Toyota"
                  maxLength={50}
                  required
                />
                {getFieldError('vehicleMake') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('vehicleMake')}</p>
                )}
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    hasFieldError('vehicleModel') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Camry"
                  maxLength={50}
                  required
                />
                {getFieldError('vehicleModel') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('vehicleModel')}</p>
                )}
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    hasFieldError('vehicleYear') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 2020"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
                {getFieldError('vehicleYear') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('vehicleYear')}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                id="issueTitle"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  hasFieldError('issueTitle') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description of the main issue"
                maxLength={200}
                required
              />
              {getFieldError('issueTitle') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('issueTitle')}</p>
              )}
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                Symptoms & Issues *
              </label>
              <textarea
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none ${
                  hasFieldError('symptoms') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the issues you're experiencing with your car..."
                maxLength={2000}
                required
              />
              <div className="flex justify-between mt-1">
                {getFieldError('symptoms') && (
                  <p className="text-sm text-red-600">{getFieldError('symptoms')}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {symptoms.length}/2000 characters
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level
                </label>
                <select
                  id="severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="low">Low - Minor issue</option>
                  <option value="medium">Medium - Noticeable problem</option>
                  <option value="high">High - Significant issue</option>
                  <option value="critical">Critical - Urgent attention needed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
                  Repair Urgency
                </label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="low">Low - Can wait</option>
                  <option value="moderate">Moderate - Schedule soon</option>
                  <option value="soon">Soon - Within a week</option>
                  <option value="immediate">Immediate - Fix now</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="estimatedCost" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost (Optional)
                </label>
                <input
                  type="text"
                  id="estimatedCost"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., $200 - $500"
                />
              </div>
              
              <div>
                <label htmlFor="customName" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Name (Optional)
                </label>
                <input
                  type="text"
                  id="customName"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Custom name for this diagnostic"
                  maxLength={100}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="Any additional information or context..."
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {notes.length}/1000 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Running AI Diagnostic...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Run AI Diagnostic
                </>
              )}
            </button>
          </form>
        ) : diagnosticMode === 'obd' ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-12 max-w-2xl mx-auto border border-blue-200">
              <div className="mb-6">
                <Bluetooth className="h-20 w-20 text-blue-500 mx-auto mb-4 opacity-60" />
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
                  <h3 className="relative text-3xl font-bold text-gray-900 mb-4">
                    OBD-II Scanner Coming Soon!
                  </h3>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We're working hard to bring you direct OBD-II port integration for real-time vehicle diagnostics. 
                This feature will allow you to connect your OBD-II scanner directly to AutoSense Pro for instant, 
                live data analysis.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Real-time Data</h4>
                  <p className="text-sm text-gray-600">Live engine parameters and sensor readings</p>
                </div>
                <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Multiple Connections</h4>
                  <p className="text-sm text-gray-600">Bluetooth, WiFi, and USB support</p>
                </div>
                <div className="bg-white/70 rounded-lg p-4 border border-blue-200">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 mb-1">Instant Analysis</h4>
                  <p className="text-sm text-gray-600">AI-powered diagnostic interpretation</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h5 className="font-medium text-blue-900 mb-1">In the meantime...</h5>
                    <p className="text-blue-800 text-sm">
                      Use our Manual Diagnostic tool to describe your car's symptoms and get AI-powered analysis and recommendations.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleModeChange('manual')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Switch to Manual Diagnostic
              </button>
            </div>
          </div>
        ) : (
          <DiagnosticHistory
            history={diagnosticHistory}
            loading={historyLoading}
            onSelectResult={handleResultClick}
            onUpdateResult={handleDiagnosticUpdate}
            showNewBadgeOnGroups={hasUnviewedDiagnostics}
          />
        )}
      </div>

      {results.length > 0 && diagnosticMode !== 'history' && (
        <DiagnosticTabs
          standardResults={results}
          formData={{
            vehicleMake: make,
            vehicleModel: model,
            vehicleYear: parseInt(year),
            symptoms: symptoms,
            issueTitle: issueTitle,
            severity: severity,
            urgency: urgency,
            estimatedCost: estimatedCost,
            customName: customName,
            notes: notes
          }}
          onSelectResult={handleResultClick}
          userId={currentUser?.id}
        />
      )}
    </div>
  );
};

export default Diagnostic;