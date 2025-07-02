import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Wrench, Users, TrendingUp, Zap, Cpu, Shield, Heart, CheckCircle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/20 border border-primary-400/30 backdrop-blur-sm mb-8 hover:bg-primary-500/30 transition-all duration-300">
            <Zap className="h-4 w-4 text-primary-200 mr-2 animate-pulse" />
            <span className="text-primary-100 text-sm font-medium">AI-Powered Automotive Diagnostics</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-16 leading-tight">
            <span className="block mb-2">Your Car's</span>
            <span className="block bg-gradient-to-r from-primary-200 via-white to-primary-200 bg-clip-text text-transparent animate-gradient leading-relaxed">
              Digital Brain
            </span>
          </h1>
          
          {/* Enhanced standout paragraph with eye-catching font and blended bold */}
          <div className="relative mb-12 max-w-5xl mx-auto">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-3xl blur-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent rounded-3xl"></div>
            
            {/* Main paragraph container */}
            <div className="relative bg-white/15 backdrop-blur-md rounded-3xl p-8 sm:p-10 lg:p-12 border border-white/30 shadow-2xl">
              <p className="text-xl md:text-2xl lg:text-3xl text-primary-100 leading-relaxed font-light tracking-wide" style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif", letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <span className="text-white/95 font-medium bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">Finally, understand your car. </span>
                Our AI translates confusing symptoms into 
                <span className="text-white/95 font-medium bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent"> clear answers </span>
                and connects you with 
                <span className="text-white/95 font-medium bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent"> real solutions from experienced mechanics </span>
                and fellow drivers. Whether it's that mysterious check engine light, strange noises, or planning your next maintenance, 
                get <span className="text-white/95 font-medium bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">instant clarity </span>
                and <span className="text-white/95 font-medium bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent"> step-by-step guidance </span>
                — no mechanic jargon, just answers you can act on. 
                <span className="text-white/95 font-medium bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent"> Join thousands of confident drivers </span>
                who've learned to take control of their car care and 
                <span className="text-white/95 font-medium bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent"> save hundreds on unnecessary repairs </span>
                by knowing what's really going on.
              </p>
              
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-6 w-1 h-1 bg-white/30 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-white/35 rounded-full animate-pulse animation-delay-2000"></div>
              <div className="absolute bottom-6 right-4 w-1 h-1 bg-white/25 rounded-full animate-pulse animation-delay-3000"></div>
            </div>
          </div>
          
          {/* Enhanced feature highlights with benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center bg-white/15 backdrop-blur-sm rounded-full px-5 py-3 border border-white/30 hover:bg-white/20 transition-all duration-300 group">
              <CheckCircle className="h-5 w-5 text-green-300 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">Instant Answers</span>
            </div>
            <div className="flex items-center bg-white/15 backdrop-blur-sm rounded-full px-5 py-3 border border-white/30 hover:bg-white/20 transition-all duration-300 group">
              <Heart className="h-5 w-5 text-red-300 mr-2 group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">Community Driven</span>
            </div>
          </div>
          
          {/* Enhanced call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              to="/diagnostic"
              className="group relative bg-white text-primary-600 hover:bg-primary-50 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center border-2 border-transparent hover:border-primary-200"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <Search className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Diagnose My Car Now</span>
              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                FREE
              </div>
            </Link>
            <Link
              to="/community"
              className="group relative bg-transparent text-white hover:bg-white/10 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center border-2 border-white/30 hover:border-white/50 backdrop-blur-sm"
            >
              <Users className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              <span>Join the Community</span>
            </Link>
          </div>
          
          {/* Social proof with genuine appeal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                  AN
                </div>
                {/* <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                  S
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                  J
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                  +
                </div> */}
              </div>
            </div>
            <p className="text-white text-lg font-medium mb-2">
              "Finally, car problems that make sense!"
            </p>
            <p className="text-primary-200 text-sm font-light italic text-primary-100">
              - Andreanosr22, a real User
            </p>
          </div>
          
          {/* Enhanced trust indicators */}
          <div className="mt-16 pt-8 border-t border-primary-400/30">
            <div className="flex justify-center items-center space-x-8 opacity-80">
              <div className="flex items-center text-primary-200 font-semibold">
                <CheckCircle className="h-4 w-4 mr-2 text-green-300" />
                Always Free to Start
              </div>
              <div className="w-1 h-1 bg-primary-300 rounded-full"></div>
              <div className="flex items-center text-primary-200 font-semibold">
                <Shield className="h-4 w-4 mr-2 text-blue-300" />
                No Hidden Costs
              </div>
              <div className="w-1 h-1 bg-primary-300 rounded-full"></div>
              <div className="flex items-center text-primary-200 font-semibold">
                <Heart className="h-4 w-4 mr-2 text-red-300" />
                Real People, Real Help
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;