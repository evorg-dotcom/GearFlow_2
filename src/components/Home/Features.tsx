import React from 'react';
import { Search, Wrench, Users, TrendingUp, Shield, Zap, Cpu, Activity, Brain, Bluetooth } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Diagnostics',
    description: 'Advanced machine learning algorithms analyze symptoms and provide instant, accurate diagnostic results with 98% precision.',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100'
  },
  {
    icon: Users,
    title: 'Community Hub',
    description: 'Access solutions from our community of automotive enthusiasts.',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'from-green-50 to-green-100'
  },
  {
    icon: Activity,
    title: 'Performance Analytics',
    description: 'Track your vehicle\'s health metrics, maintenance history, and performance improvements over time.',
    gradient: 'from-orange-500 to-orange-600',
    bgGradient: 'from-orange-50 to-orange-100'
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get comprehensive diagnostic results, part recommendations, and repair estimates in under 30 seconds.',
    gradient: 'from-yellow-500 to-yellow-600',
    bgGradient: 'from-yellow-50 to-yellow-100'
  }
];

const Features: React.FC = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary-300 rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 border border-primary-200 mb-6">
            <Cpu className="h-4 w-4 text-primary-600 mr-2" />
            <span className="text-primary-700 text-sm font-semibold">CUTTING-EDGE TECHNOLOGY</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-primary-600">for Car Excellence</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            From AI-powered diagnostics to performance tuning, we provide the most comprehensive 
            automotive platform with cutting-edge technology and community support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-transparent rounded-bl-full opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary-50 to-transparent rounded-tr-full opacity-50"></div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
      </div>
    </div>
  );
};

export default Features;