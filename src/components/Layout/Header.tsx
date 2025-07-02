import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, User, LogOut, Zap, Menu, X, Shield, FileText, ChevronDown, UserCircle, Edit, Bell, HelpCircle } from 'lucide-react';
import { WAFDashboard } from '../../security/wafDashboard';
import { CaseSensitiveDashboard } from '../Security/CaseSensitiveDashboard';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWAFDashboard, setShowWAFDashboard] = useState(false);
  const [showCaseSensitiveDashboard, setShowCaseSensitiveDashboard] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      setProfileMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/diagnostic', label: 'Diagnostic', description: 'AI-powered car diagnostics' },
    { path: '/tuning', label: 'Tuning Parts', description: 'Performance enhancement parts' },
    { path: '/community', label: 'Community', description: 'Expert automotive community' },
    { path: '/issues', label: 'Common Issues', description: 'Known car problems & solutions' }
  ];

  // Close mobile menu when clicking on navigation links
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const getUserDisplayName = () => {
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-primary-100 dark:border-slate-700 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            {/* Logo Section - Always visible on left */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 group" onClick={handleNavClick}>
                <div className="relative transform transition-all duration-300 group-hover:scale-110">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  
                  {/* Logo container */}
                  <div className="relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-800 dark:to-slate-700 p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl border border-primary-200 dark:border-slate-600 group-hover:border-primary-300 dark:group-hover:border-slate-500 transition-all duration-300">
                    <Settings className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-all duration-300 transform group-hover:rotate-12" />
                    <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-yellow-500 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 animate-pulse group-hover:animate-bounce" />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl lg:text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-primary-900 dark:group-hover:from-primary-300 dark:group-hover:to-primary-500 transition-all duration-300">
                    GearFlo
                  </span>
                  <span className="hidden sm:block text-xs lg:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    AI-POWERED DIAGNOSTICS
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile and tablet */}
            <nav className="hidden xl:flex space-x-6 2xl:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative group px-4 py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border-2 border-emerald-300 hover:border-emerald-400 ${
                    isActivePage(item.path)
                      ? 'text-primary-600 dark:text-primary-400 border-emerald-400 shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {/* Content */}
                  <span className="relative z-10 group-hover:drop-shadow-sm transition-all duration-300 text-sm lg:text-base">
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActivePage(item.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* User Section & Mobile Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 xl:space-x-6">
              {/* Security Dashboard Buttons - Only for authenticated users */}
              

              {/* Desktop User Section - Hidden on mobile */}
              {currentUser ? (
                <div className="hidden sm:flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
                  {/* Profile Menu */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="group relative flex items-center space-x-2 lg:space-x-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 lg:px-4 lg:py-2.5 xl:px-5 xl:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border-2 border-emerald-300 hover:border-emerald-400"
                    >
                      {/* Profile Avatar */}
                      <div className="relative">
                        <div className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm lg:text-base shadow-lg">
                          {getUserInitials()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                      </div>
                      
                      {/* User Name - Hidden on smaller screens */}
                      <div className="hidden lg:block">
                        <span className="text-sm lg:text-base font-medium">{getUserDisplayName()}</span>
                      </div>
                      
                      {/* Dropdown Arrow */}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {getUserInitials()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{getUserDisplayName()}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setProfileMenuOpen(false);
                              navigate('/profile');
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <UserCircle className="h-4 w-4 mr-3" />
                            View Profile
                          </button>
                          
                          <button
                            onClick={() => {
                              setProfileMenuOpen(false);
                              navigate('/profile/edit');
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-3" />
                            Edit Profile
                          </button>
                          
                          <button
                            onClick={() => {
                              setProfileMenuOpen(false);
                              navigate('/settings');
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Account Settings
                          </button>
                          
                          
                          
                          
                        </div>

                        {/* Logout Section */}
                        <div className="border-t border-gray-200 dark:border-slate-700 py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
                  {/* Login Button - Light green border, no background */}
                  <Link
                    to="/login"
                    className="group relative px-4 py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 border-2 border-emerald-300 hover:border-emerald-400"
                  >
                    <span className="relative z-10 group-hover:drop-shadow-sm transition-all duration-300 text-sm lg:text-base">Login</span>
                  </Link>
                  
                  {/* Sign Up Button - Light green border, no background */}
                  <Link
                    to="/signup"
                    className="group relative px-4 py-2.5 lg:px-5 lg:py-3 xl:px-6 xl:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 border-2 border-emerald-300 hover:border-emerald-400"
                  >
                    <span className="relative z-10 group-hover:drop-shadow-sm transition-all duration-300 text-sm lg:text-base">Sign Up</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button - Always visible on mobile/tablet */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden group relative p-2 sm:p-2.5 lg:p-3 rounded-lg lg:rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 transform hover:scale-110 border-2 border-emerald-300 hover:border-emerald-400"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Navigation Menu */}
          {mobileMenuOpen && (
            <div className="xl:hidden border-t border-primary-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md animate-in slide-in-from-top duration-300">
              <div className="py-4 sm:py-5 lg:py-6 space-y-1">
                {/* Navigation Links */}
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`group relative block px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-4 rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 mx-2 sm:mx-3 lg:mx-4 border-2 border-emerald-300 hover:border-emerald-400 ${
                      isActivePage(item.path)
                        ? 'text-primary-600 dark:text-primary-400 border-emerald-400 shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="font-semibold text-base sm:text-lg">{item.label}</div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300 mt-1">
                        {item.description}
                      </div>
                    </div>
                    
                    {/* Active indicator */}
                    {isActivePage(item.path) && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 sm:h-10 bg-primary-600 dark:bg-primary-400 rounded-r-full animate-pulse"></div>
                    )}
                  </Link>
                ))}

                {/* Mobile User Section */}
                <div className="border-t border-primary-100 dark:border-slate-700 mt-4 pt-4 mx-2 sm:mx-3 lg:mx-4">
                  {currentUser ? (
                    <div className="space-y-3">
                      {/* Mobile User Info */}
                      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-slate-800 dark:to-slate-700 px-4 py-3 sm:px-5 sm:py-4 rounded-lg lg:rounded-xl border border-primary-200 dark:border-slate-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {getUserInitials()}
                          </div>
                          <div>
                            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium block">
                              {getUserDisplayName()}
                            </span>
                            <span className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 truncate block">
                              {currentUser.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Profile Menu Items */}
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/profile');
                          }}
                          className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <UserCircle className="h-5 w-5 mr-3" />
                          <span className="text-sm sm:text-base">View Profile</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/profile/edit');
                          }}
                          className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Edit className="h-5 w-5 mr-3" />
                          <span className="text-sm sm:text-base">Edit Profile</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/settings');
                          }}
                          className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Settings className="h-5 w-5 mr-3" />
                          <span className="text-sm sm:text-base">Account Settings</span>
                        </button>
                        
                        
                        
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/help');
                          }}
                          className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <HelpCircle className="h-5 w-5 mr-3" />
                          <span className="text-sm sm:text-base">Help & Support</span>
                        </button>
                      </div>
                      
                      {/* Security Dashboard Buttons - Mobile */}
                      
                      
                      {/* Mobile Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="group relative w-full flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-4 py-3 sm:px-5 sm:py-4 rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border-2 border-emerald-300 hover:border-red-400"
                      >
                        <LogOut className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative z-10 text-base sm:text-lg">Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Mobile Login Button - Light green border, no background */}
                      <Link
                        to="/login"
                        onClick={handleNavClick}
                        className=" lg:hidden group relative block w-full text-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-3 sm:px-5 sm:py-4 rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border-2 border-emerald-300 hover:border-emerald-400"
                      >
                        <span className="relative z-10 group-hover:drop-shadow-sm text-base sm:text-lg">Login</span>
                      </Link>
                      
                      {/* Mobile Sign Up Button - Light green border, no background */}
                      <Link
                        to="/signup"
                        onClick={handleNavClick}
                        className="lg:hidden group relative block w-full text-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-3 sm:px-5 sm:py-4 rounded-lg lg:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border-2 border-emerald-300 hover:border-emerald-400"
                      >
                        <span className="relative z-10 group-hover:drop-shadow-sm text-base sm:text-lg">Sign Up</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Security Dashboard Modals */}
      <WAFDashboard 
        isOpen={showWAFDashboard} 
        onClose={() => setShowWAFDashboard(false)} 
      />
      
      <CaseSensitiveDashboard 
        isOpen={showCaseSensitiveDashboard} 
        onClose={() => setShowCaseSensitiveDashboard(false)} 
      />
    </>
  );
};

export default Header;