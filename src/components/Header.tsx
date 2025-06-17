import React from 'react';
import { Plane, CreditCard, Target } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Plane className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Travel Rewards Optimizer</h1>
              <p className="text-blue-100">Maximize your points for India 2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm">5 Cards Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span className="text-sm">345K Total Points</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;