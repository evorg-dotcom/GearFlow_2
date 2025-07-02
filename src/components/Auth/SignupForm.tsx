import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, AlertCircle, CheckCircle, Settings, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { validateEmail, validatePassword } from '../../utils/validation';
import { SecurityUtils } from '../../utils/security';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{ isValid: boolean; errors: string[]; }>({ isValid: false, errors: [] });
  const [csrfToken] = useState(() => SecurityUtils.generateCSRFToken());
  const [emailError, setEmailError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    const validation = validatePassword(newPassword);
    setPasswordValidation(validation);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value.trim();
    setEmail(emailValue);
    
    // Clear email error when user starts typing
    if (emailError) {
      setEmailError('');
    }
    
    // Real-time email validation feedback (but don't block)
    if (emailValue.length > 0 && !validateEmail(emailValue)) {
      // Only show error if it's clearly invalid (not just incomplete)
      if (emailValue.includes('@') && emailValue.includes('.')) {
        setEmailError('Please check your email format');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError('');
    setEmailError('');

    // Input validation with more detailed feedback
    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address (e.g., user@example.com)');
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Please fix the password requirements below');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Rate limiting check
    if (!SecurityUtils.checkRateLimit(email)) {
      setError('Too many signup attempts. Please try again in 15 minutes.');
      SecurityUtils.logSecurityEvent('signup_rate_limit_exceeded', { email });
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      SecurityUtils.resetRateLimit(email);
      SecurityUtils.logSecurityEvent('successful_signup', { email });
      navigate('/');
    } catch (error: any) {
      const sanitizedError = SecurityUtils.sanitizeErrorMessage(error);
      setError(sanitizedError);
      SecurityUtils.logSecurityEvent('failed_signup', { email, error: error?.code });
    }

    setLoading(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-forest-green hover:text-forest-green-dark transition-colors duration-300 group"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>
          </div>

          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
                <Settings className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-forest-green" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-forest-green mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
              Join GearFlo for advanced car diagnostics
            </p>
          </div>

          {/* Sign-up Form */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-6 sm:p-8">
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="csrf_token" value={csrfToken} />
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0" />
                    <p className="text-red-700 text-xs sm:text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    className={`appearance-none block w-full px-3 py-3 sm:py-4 pl-10 sm:pl-12 border rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green bg-gray-100 text-sm sm:text-base transition-colors ${
                      emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email (e.g., user@example.com)"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                {emailError && (
                  <div className="mt-1 flex items-center text-red-600 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}
                {email && !emailError && validateEmail(email) && (
                  <div className="mt-1 flex items-center text-green-600 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Valid email format</span>
                  </div>
                )}
              </div>
              
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    maxLength={128}
                    className="appearance-none block w-full px-3 py-3 sm:py-4 pl-10 sm:pl-12 pr-10 sm:pr-12 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green bg-gray-100 text-sm sm:text-base"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {password && (
                  <div className="mt-3 space-y-2">
                    {passwordValidation.errors.map((error, index) => (
                      <div key={index} className="flex items-center text-xs text-red-600">
                        <AlertCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    ))}
                    {passwordValidation.isValid && (
                      <div className="flex items-center text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>Password meets all requirements</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirm-password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    maxLength={128}
                    className="appearance-none block w-full px-3 py-3 sm:py-4 pl-10 sm:pl-12 pr-10 sm:pr-12 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-forest-green bg-gray-100 text-sm sm:text-base"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="mt-1 flex items-center text-red-600 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Passwords do not match</span>
                  </div>
                )}
                {confirmPassword && password === confirmPassword && password.length > 0 && (
                  <div className="mt-1 flex items-center text-green-600 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !passwordValidation.isValid || !validateEmail(email) || password !== confirmPassword}
                  className="w-full flex justify-center items-center py-3 sm:py-4 px-4 border border-transparent text-sm sm:text-base lg:text-lg font-medium rounded-lg text-white bg-forest-green hover:bg-forest-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-forest-green hover:text-forest-green-dark transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-gray-500 px-4">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;