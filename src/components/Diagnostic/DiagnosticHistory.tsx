import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, Car, Clock, AlertTriangle, CheckCircle, History, Trash2, Edit3, Tag, Plus, X, ChevronDown, ChevronRight } from 'lucide-react';
import DiagnosticCard from './DiagnosticCard';

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

interface DiagnosticHistoryProps {
  history: DiagnosticResult[];
  loading?: boolean;
  onSelectResult: (result: DiagnosticResult) => void;
  onUpdateResult?: (result: DiagnosticResult) => void;
  showNewBadgeOnGroups?: boolean;
}

interface EditModalProps {
  result: DiagnosticResult;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedResult: DiagnosticResult) => void;
}

const EditModal: React.FC<EditModalProps> = ({ result, isOpen, onClose, onSave }) => {
  const [customName, setCustomName] = useState(result.customName || '');
  const [tags, setTags] = useState<string[]>(result.tags || []);
  const [notes, setNotes] = useState(result.notes || '');
  const [newTag, setNewTag] = useState('');
  const [repairStatus, setRepairStatus] = useState(result.repairStatus || 'pending');

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    const updatedResult = {
      ...result,
      customName: customName.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      notes: notes.trim() || undefined,
      repairStatus
    };
    onSave(updatedResult);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Edit Diagnostic</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Custom Name */}
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
                placeholder="Give this diagnostic a memorable name..."
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {100 - customName.length} characters remaining
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add a tag..."
                  maxLength={20}
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Add tags to help categorize and find this diagnostic later
              </p>
            </div>

            {/* Repair Status */}
            <div>
              <label htmlFor="repairStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Repair Status
              </label>
              <select
                id="repairStatus"
                value={repairStatus}
                onChange={(e) => setRepairStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="Add any additional notes about this diagnostic..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {500 - notes.length} characters remaining
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiagnosticHistory: React.FC<DiagnosticHistoryProps> = ({ 
  history, 
  loading = false,
  onSelectResult, 
  onUpdateResult, 
  showNewBadgeOnGroups = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'cost' | 'name'>('date');
  const [editingResult, setEditingResult] = useState<DiagnosticResult | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const severities = ['all', 'low', 'medium', 'high', 'critical'];
  const types = ['all', 'manual', 'obd'];
  const statuses = ['all', 'pending', 'in_progress', 'completed', 'cancelled'];

  // Enhanced filtering and sorting
  const filteredAndSortedHistory = useMemo(() => {
    let filtered = history.filter(result => {
      const searchableText = [
        result.issue,
        result.description,
        result.customName,
        result.notes,
        ...(result.tags || []),
        result.vehicleInfo ? `${result.vehicleInfo.make} ${result.vehicleInfo.model} ${result.vehicleInfo.year}` : ''
      ].join(' ').toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
      const matchesSeverity = selectedSeverity === 'all' || result.severity === selectedSeverity;
      const matchesType = selectedType === 'all' || result.diagnosticType === selectedType;
      const matchesStatus = selectedStatus === 'all' || (result.repairStatus || 'pending') === selectedStatus;
      
      return matchesSearch && matchesSeverity && matchesType && matchesStatus;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.timestamp - a.timestamp;
        case 'severity':
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case 'cost':
          const getCostValue = (cost: string) => {
            const match = cost.match(/\$(\d+)/);
            return match ? parseInt(match[1]) : 0;
          };
          return getCostValue(b.estimatedCost) - getCostValue(a.estimatedCost);
        case 'name':
          const nameA = a.customName || a.issue;
          const nameB = b.customName || b.issue;
          return nameA.localeCompare(nameB);
        default:
          return b.timestamp - a.timestamp;
      }
    });

    return filtered;
  }, [history, searchTerm, selectedSeverity, selectedType, selectedStatus, sortBy]);

  // Group results by time periods for better organization
  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: DiagnosticResult[] } = {};
    const now = new Date();
    
    filteredAndSortedHistory.forEach(result => {
      const resultDate = new Date(result.timestamp);
      const diffInDays = Math.floor((now.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let groupKey: string;
      if (diffInDays === 0) {
        groupKey = 'Today';
      } else if (diffInDays === 1) {
        groupKey = 'Yesterday';
      } else if (diffInDays <= 7) {
        groupKey = 'This Week';
      } else if (diffInDays <= 30) {
        groupKey = 'This Month';
      } else if (diffInDays <= 90) {
        groupKey = 'Last 3 Months';
      } else if (diffInDays <= 365) {
        groupKey = 'This Year';
      } else {
        groupKey = 'Older';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(result);
    });
    
    return groups;
  }, [filteredAndSortedHistory]);

  // Check if a group has new entries (only Today group should show new badge)
  const groupHasNewEntries = (groupName: string, groupResults: DiagnosticResult[]) => {
    if (!showNewBadgeOnGroups) return false;
    
    // Only show "New" badge on "Today" group when there are new entries
    if (groupName !== 'Today') return false;
    
    // Check if any result in this group is from today (indicating it's new)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return groupResults.some(result => {
      const resultDate = new Date(result.timestamp);
      resultDate.setHours(0, 0, 0, 0);
      return resultDate.getTime() === today.getTime();
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCompactDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditResult = (result: DiagnosticResult) => {
    setEditingResult(result);
  };

  const handleSaveEdit = (updatedResult: DiagnosticResult) => {
    if (onUpdateResult) {
      onUpdateResult(updatedResult);
    }
    setEditingResult(null);
  };

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'manual': return 'text-blue-600 bg-blue-100';
      case 'obd': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'pending':
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'pending':
      default: return 'Pending';
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span className="ml-4 text-gray-600">Loading diagnostic history...</span>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Diagnostic History</h3>
        <p className="text-gray-600 mb-6">
          Your completed diagnostic scans will appear here for easy access and review.
        </p>
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-primary-800 text-sm">
            <strong>Tip:</strong> Run a manual diagnostic or OBD-II scan to start building your diagnostic history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
            <History className="h-7 w-7 mr-3 text-primary-600" />
            Diagnostic History
          </h3>
          <p className="text-gray-600 mt-1">
            {history.length} diagnostic{history.length !== 1 ? 's' : ''} shown • Limited to 25 most recent
          </p>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search diagnostics, names, tags, or vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {severities.map(severity => (
                <option key={severity} value={severity}>
                  {severity === 'all' ? 'All Severities' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type === 'obd' ? 'OBD-II' : 'Manual'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'severity' | 'cost' | 'name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="severity">Sort by Severity</option>
              <option value="cost">Sort by Cost</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
        
        {/* Bulk Actions */}
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedHistory.length} of {history.length} diagnostics
          </div>
        </div>
      </div>

      {/* Grouped History List */}
      <div className="space-y-8">
        {Object.entries(groupedHistory).map(([groupName, results]) => (
          <div key={groupName}>
            {/* Collapsible Group Header with New Badge */}
            <div 
              className="flex items-center mb-4 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
              onClick={() => toggleGroupCollapse(groupName)}
            >
              <button className="flex items-center text-gray-500 hover:text-gray-700 mr-2">
                {collapsedGroups.has(groupName) ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              <h4 className="text-lg font-semibold text-gray-900 mr-3">{groupName}</h4>
              
              {/* New Badge - Only show on groups that have new entries */}
              {groupHasNewEntries(groupName, results) && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-3 animate-pulse">
                  New
                </span>
              )}
              
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="ml-3 text-sm text-gray-500">
                {results.length} diagnostic{results.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Collapsible Results in Group */}
            {!collapsedGroups.has(groupName) && (
              <div className="space-y-4 animate-in slide-in-from-top duration-200">
                {results.map((result) => (
                  <div key={result.id} className="relative">
                    {/* Enhanced Diagnostic Card */}
                    <div>
                      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-primary-500">
                        {/* Enhanced Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.diagnosticType)}`}>
                                {result.diagnosticType === 'obd' ? 'OBD-II Scan' : 'Manual Diagnostic'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.repairStatus || 'pending')}`}>
                                {getStatusLabel(result.repairStatus || 'pending')}
                              </span>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatCompactDate(result.timestamp)}
                              </div>
                            </div>

                            {/* Custom Name or Issue */}
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {result.customName || result.issue}
                            </h4>
                            {result.customName && (
                              <p className="text-sm text-gray-600 mb-2">Original: {result.issue}</p>
                            )}

                            {/* Vehicle Info */}
                            {result.vehicleInfo && (
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <Car className="h-4 w-4 mr-1" />
                                {result.vehicleInfo.year} {result.vehicleInfo.make} {result.vehicleInfo.model}
                              </div>
                            )}

                            {/* Tags */}
                            {result.tags && result.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {result.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                                  >
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Notes Preview */}
                            {result.notes && (
                              <p className="text-sm text-gray-600 italic">
                                "{result.notes.length > 100 ? result.notes.substring(0, 100) + '...' : result.notes}"
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditResult(result);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Edit diagnostic details"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Use existing DiagnosticCard component */}
                        <div onClick={() => onSelectResult(result)}>
                          <DiagnosticCard 
                            result={result} 
                            onClick={() => {}} // Handled by parent div
                            isSelected={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAndSortedHistory.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find the diagnostics you're looking for.
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingResult && (
        <EditModal
          result={editingResult}
          isOpen={true}
          onClose={() => setEditingResult(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default DiagnosticHistory;