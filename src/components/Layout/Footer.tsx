import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, AlertTriangle, X, Send } from 'lucide-react';

interface ReportIssueForm {
  name: string;
  email: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  issueTitle: string;
  issueDescription: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const Footer: React.FC = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportForm, setReportForm] = useState<ReportIssueForm>({
    name: '',
    email: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    issueTitle: '',
    issueDescription: '',
    severity: 'medium'
  });
  const [formErrors, setFormErrors] = useState<Partial<ReportIssueForm>>({});

  const validateForm = (): boolean => {
    const errors: Partial<ReportIssueForm> = {};

    if (!reportForm.name.trim()) errors.name = 'Name is required';
    if (!reportForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reportForm.email)) errors.email = 'Invalid email format';
    if (!reportForm.vehicleMake.trim()) errors.vehicleMake = 'Vehicle make is required';
    if (!reportForm.vehicleModel.trim()) errors.vehicleModel = 'Vehicle model is required';
    if (!reportForm.vehicleYear.trim()) errors.vehicleYear = 'Vehicle year is required';
    else {
      const year = parseInt(reportForm.vehicleYear);
      if (isNaN(year) || year < 1990 || year > new Date().getFullYear() + 1) {
        errors.vehicleYear = 'Invalid year';
      }
    }
    if (!reportForm.issueTitle.trim()) errors.issueTitle = 'Issue title is required';
    if (!reportForm.issueDescription.trim()) errors.issueDescription = 'Issue description is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ReportIssueForm, value: string) => {
    setReportForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowReportModal(false);
        setSubmitted(false);
        setReportForm({
          name: '',
          email: '',
          vehicleMake: '',
          vehicleModel: '',
          vehicleYear: '',
          issueTitle: '',
          issueDescription: '',
          severity: 'medium'
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <>
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-3 rounded-xl border border-primary-200">
                    <Settings className="h-8 w-8 text-primary-600" />
                    <Zap className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                    GearFlo
                  </h3>
                  <p className="text-xs text-primary-400 font-medium tracking-wide">
                    AI-POWERED DIAGNOSTICS
                  </p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Revolutionary AI-powered car diagnostics, and community-driven solutions for automotive enthusiasts worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/diagnostic" className="text-slate-300 hover:text-primary-400 transition-colors text-sm">
                    AI Diagnostics
                  </Link>
                </li>
                <li>
                  <Link to="/tuning" className="text-slate-300 hover:text-primary-400 transition-colors text-sm">
                    Tuning Parts
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-slate-300 hover:text-primary-400 transition-colors text-sm">
                    Community Hub
                  </Link>
                </li>
                <li>
                  <Link to="/issues" className="text-slate-300 hover:text-primary-400 transition-colors text-sm">
                    Common Issues
                  </Link>
                </li>
              </ul>
            </div>

            

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-300 text-sm">
                  <Mail className="h-4 w-4 mr-3 text-primary-400" />
                  sample@gearflo.com
                </li>
                <li className="flex items-center text-slate-300 text-sm">
                  <Phone className="h-4 w-4 mr-3 text-primary-400" />
                  901-800-GEARFLO
                </li>
                <li className="flex items-start text-slate-300 text-sm">
                  <MapPin className="h-4 w-4 mr-3 text-primary-400 mt-0.5" />
                  <span>
                    1000 Innovation Drive<br />
                    Tech City, BoltLand 62000
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700 mt-8 pt-8">

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm mb-4 md:mb-0">
            <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
              <img className="h-20 mb-2" src="/evorg-dotcom/GearFlow_2.git/black_circle_360x360.png" alt="Powered by Bolt" />
            </a>
                Bolt Powered Project in conjunction with Supabase              
          </div>
          <div className="flex space-x-6 text-sm">


                <a href="https://www.linkedin.com/in/sidneyandreano/" className="text-slate-400 hover:text-primary-400 transition-colors">
                  Sidney Andreano
                </a>
                <a href="https://www.linkedin.com/in/evan-alford22232/" className="text-slate-400 hover:text-primary-400 transition-colors">
                  Evan Alford
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-orange-500" />
                  Report a Car Issue
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Report Submitted!</h4>
                  <p className="text-gray-600">
                    Thank you for reporting this issue. Our team will review it and add it to our database if verified.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Help us improve our database!</strong> Report car issues you've experienced to help other drivers. 
                      Our team will verify and add legitimate issues to our common issues database.
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={reportForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          formErrors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                        }`}
                        placeholder="Enter your full name"
                        maxLength={100}
                      />
                      {formErrors.name && (
                        <span className="text-red-500 text-xs mt-1">{formErrors.name}</span>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={reportForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          formErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                        }`}
                        placeholder="Enter your email"
                        maxLength={254}
                      />
                      {formErrors.email && (
                        <span className="text-red-500 text-xs mt-1">{formErrors.email}</span>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Make *
                      </label>
                      <input
                        type="text"
                        id="vehicleMake"
                        value={reportForm.vehicleMake}
                        onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          formErrors.vehicleMake ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                        }`}
                        placeholder="e.g., Honda"
                        maxLength={50}
                      />
                      {formErrors.vehicleMake && (
                        <span className="text-red-500 text-xs mt-1">{formErrors.vehicleMake}</span>
                      )}
                    </div>

                    <div>
                      <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Model *
                      </label>
                      <input
                        type="text"
                        id="vehicleModel"
                        value={reportForm.vehicleModel}
                        onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          formErrors.vehicleModel ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                        }`}
                        placeholder="e.g., Civic"
                        maxLength={50}
                      />
                      {formErrors.vehicleModel && (
                        <span className="text-red-500 text-xs mt-1">{formErrors.vehicleModel}</span>
                      )}
                    </div>

                    <div>
                      <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700 mb-2">
                        Vehicle Year *
                      </label>
                      <input
                        type="number"
                        id="vehicleYear"
                        value={reportForm.vehicleYear}
                        onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          formErrors.vehicleYear ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                        }`}
                        placeholder="e.g., 2020"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                      />
                      {formErrors.vehicleYear && (
                        <span className="text-red-500 text-xs mt-1">{formErrors.vehicleYear}</span>
                      )}
                    </div>
                  </div>

                  {/* Issue Information */}
                  <div>
                    <label htmlFor="issueTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Title *
                    </label>
                    <input
                      type="text"
                      id="issueTitle"
                      value={reportForm.issueTitle}
                      onChange={(e) => handleInputChange('issueTitle', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        formErrors.issueTitle ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                      placeholder="Brief description of the issue"
                      maxLength={150}
                    />
                    {formErrors.issueTitle && (
                      <span className="text-red-500 text-xs mt-1">{formErrors.issueTitle}</span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Severity
                    </label>
                    <select
                      id="severity"
                      value={reportForm.severity}
                      onChange={(e) => handleInputChange('severity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="low">Low - Minor inconvenience</option>
                      <option value="medium">Medium - Affects performance</option>
                      <option value="high">High - Safety concern</option>
                      <option value="critical">Critical - Immediate danger</option>
                    </select>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(reportForm.severity)}`}>
                        {reportForm.severity.charAt(0).toUpperCase() + reportForm.severity.slice(1)} Severity
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      id="issueDescription"
                      value={reportForm.issueDescription}
                      onChange={(e) => handleInputChange('issueDescription', e.target.value)}
                      rows={6}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                        formErrors.issueDescription ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
                      }`}
                      placeholder="Describe the issue in detail including symptoms, when it occurs, potential causes, and any solutions you've tried..."
                      maxLength={1000}
                    />
                    {formErrors.issueDescription && (
                      <span className="text-red-500 text-xs mt-1">{formErrors.issueDescription}</span>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {1000 - reportForm.issueDescription.length} characters remaining
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
