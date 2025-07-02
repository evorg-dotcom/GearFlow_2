import React from 'react';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Stats from '../components/Home/Stats';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Stats />
    </div>
  );
};

export default Home;