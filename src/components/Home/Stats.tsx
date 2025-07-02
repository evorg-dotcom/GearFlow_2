import React from 'react';
import { TrendingUp, Users, CheckCircle, Zap } from 'lucide-react';

const stats = [
  { 
    number: '300+', 
    label: 'Diagnostic Sources',
    icon: CheckCircle,
    description: 'Accurate Diagnostic Sources including the NHTSA public database'
  },
  { 
    number: '60+', 
    label: 'Performance Parts',
    icon: Zap,
    description: 'Verified tuning parts in our catalog'
  },
  { 
    number: '', 
    label: 'Community Solutions',
    icon: Users,
    description: 'Our community is increasing wih Expert solutions from our community'
  },
  { 
    number: '98%', 
    label: 'Success Rate',
    icon: TrendingUp,
    description: 'Diagnostic accuracy rate achieved'
  }
];

const Stats: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-4000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Features & Stats
          </h2>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Our platform delivers industry-leading results that car enthusiasts can rely on daily.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors duration-300">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                
                <div className="text-primary-200 text-lg font-semibold mb-2">
                  {stat.label}
                </div>
                
                <div className="text-primary-300 text-sm">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional trust indicators */}
        <div className="mt-16 pt-8 border-t border-white/20">
          
        </div>
      </div>
    </div>
  );
};

export default Stats;