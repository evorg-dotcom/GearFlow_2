// WAF Security Dashboard Component
import React, { useState, useEffect } from 'react';
import { WAF, type WAFEvent } from './waf';
import { Shield, AlertTriangle, Activity, TrendingUp, Eye, Filter, Download, RefreshCw } from 'lucide-react';

interface WAFDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WAFDashboard: React.FC<WAFDashboardProps> = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState<WAFEvent[]>([]);
  const [stats, setStats] = useState<any>({});
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadData, 30000);
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isOpen]);

  const loadData = () => {
    setEvents(WAF.getEvents(500));
    setStats(WAF.getStats());
  };

  const filteredEvents = events.filter(event => {
    const severityMatch = selectedSeverity === 'all' || event.severity === selectedSeverity;
    const actionMatch = selectedAction === 'all' || event.action === selectedAction;
    return severityMatch && actionMatch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'text-red-600 bg-red-100';
      case 'sanitize': return 'text-yellow-600 bg-yellow-100';
      case 'log': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportEvents = () => {
    const csvContent = [
      'Timestamp,Rule ID,Rule Name,Severity,Action,Input,URL',
      ...filteredEvents.map(event => 
        `${new Date(event.timestamp).toISOString()},${event.ruleId},${event.ruleName},${event.severity},${event.action},"${event.input.replace(/"/g, '""')}",${event.url}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waf-events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">WAF Security Dashboard</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadData}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={exportEvents}
                className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-600">Total Events</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalEvents || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-red-600">Blocked Requests</p>
                  <p className="text-2xl font-bold text-red-900">{stats.blockedRequests || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <Filter className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm text-yellow-600">Sanitized</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.sanitizedRequests || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-red-600">Critical Events</p>
                  <p className="text-2xl font-bold text-red-900">{stats.criticalEvents || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Actions</option>
                  <option value="block">Block</option>
                  <option value="sanitize">Sanitize</option>
                  <option value="log">Log</option>
                </select>
              </div>
            </div>
          </div>

          {/* Top Rules */}
          {stats.topRules && stats.topRules.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Most Triggered Rules</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rule ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Triggers
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.topRules.slice(0, 5).map((rule: any, index: number) => (
                      <tr key={rule.ruleId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rule.ruleId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Events List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Recent Events ({filteredEvents.length})
            </h3>
            
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No events found matching the current filters.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredEvents.map((event, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(event.severity)}`}>
                          {event.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(event.action)}`}>
                          {event.action.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{event.ruleName}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Rule ID:</strong> {event.ruleId}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Input:</strong> 
                      <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                        {event.input}
                      </code>
                    </div>
                    
                    {event.sanitized && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Sanitized:</strong> 
                        <code className="ml-2 px-2 py-1 bg-green-100 rounded text-xs">
                          {event.sanitized}
                        </code>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      <strong>URL:</strong> {event.url}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};