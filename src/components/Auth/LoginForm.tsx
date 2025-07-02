import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Settings, Zap, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { validateEmail } from '../../utils/validation';
import { SecurityUtils } from '../../utils/security';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [csrfToken] = useState(() => SecurityUtils.generateCSRFToken());
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Basic validation without WAF interference for login
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    // Input validation
    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Rate limiting check
    if (!SecurityUtils.checkRateLimit(trimmedEmail)) {
      setError('Too many login attempts. Please try again in 15 minutes.');
      SecurityUtils.logSecurityEvent('rate_limit_exceeded', { email: trimmedEmail });
      return;
    }

    try {
      setLoading(true);
      await login(trimmedEmail, trimmedPassword);
      SecurityUtils.resetRateLimit(trimmedEmail);
      SecurityUtils.logSecurityEvent('successful_login', { email: trimmedEmail });
      navigate('/');
    } catch (error: any) {
      const sanitizedError = SecurityUtils.sanitizeErrorMessage(error);
      setError(sanitizedError);
      SecurityUtils.logSecurityEvent('failed_login', { email: trimmedEmail, error: error?.code });
    }
    
    setLoading(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors duration-300 group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>
          </div>

          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative group">
                <div className="bg-slate-800 border border-emerald-500/30 rounded-full p-4 sm:p-6 shadow-2xl">
                  <Settings className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-emerald-400" />
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-400 absolute -top-1 -right-1" />
                </div>
              </div>
            </div>
              <div className="w-full border-t border-slate-600"></div>
            {/* Brand Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                New to GearFlo?
              </span>
            </h1>
            <p className="text-emerald-400 text-xs sm:text-sm lg:text-base font-medium tracking-wide mb-4 sm:mb-6">
              AI-POWERED DIAGNOSTICS
            </p>

            {/* Welcome Message */}
            <div className="bg-slate-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-500/20 mb-6 sm:mb-8 shadow-2xl">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Sign in to access your automotive diagnostic dashboard
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl">
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="csrf_token" value={csrfToken} />
              
              {error && (
                <div className="bg-red-900/50 border border-red-500/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <p className="text-red-300 text-xs sm:text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 sm:space-y-5">
                {/* Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      className="appearance-none relative block w-full px-3 py-3 sm:px-4 sm:py-4 pl-10 sm:pl-12 bg-slate-700/50 border border-slate-600 placeholder-slate-400 text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="group">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      maxLength={128}
                      className="appearance-none relative block w-full px-3 py-3 sm:px-4 sm:py-4 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-slate-700/50 border border-slate-600 placeholder-slate-400 text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm text-sm sm:text-base"
                      placeholder="Enter your password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 hover:text-emerald-300 transition-colors duration-300" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 hover:text-emerald-300 transition-colors duration-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent text-sm sm:text-base lg:text-lg font-bold rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
                >
                  <span className="flex items-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 border-b-2 border-white mr-2 sm:mr-3"></div>
                        Signing you in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-3 sm:px-4 bg-slate-800 text-slate-400">
                    New to AutoSense Pro?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-2">
                <Link
                  to="/signup"
                  className="group inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300 text-sm sm:text-base"
                >
                  Create your account
                  <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </form>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="text-center">
              <div className="bg-slate-800/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-500/20 hover:bg-slate-700/80 transition-all duration-300 shadow-lg">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-400 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-slate-300">AI Diagnostics</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-500/20 hover:bg-slate-700/80 transition-all duration-300 shadow-lg">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-400 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-slate-300">OBD Scanning</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-500/20 hover:bg-slate-700/80 transition-all duration-300 shadow-lg">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-400 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-slate-300">Expert Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;