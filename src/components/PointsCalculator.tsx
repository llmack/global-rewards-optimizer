import React, { useState } from 'react';
import { Calculator, ArrowRight, Zap, Target } from 'lucide-react';
import { CreditCard } from '../types';

interface PointsCalculatorProps {
  cards: CreditCard[];
}

const PointsCalculator: React.FC<PointsCalculatorProps> = ({ cards }) => {
  const [targetPoints, setTargetPoints] = useState(170000);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const totalAvailablePoints = cards.reduce((sum, card) => sum + card.currentPoints, 0);
  const totalSignupBonuses = cards.reduce((sum, card) => sum + card.signupBonus, 0);

  const shortfall = Math.max(0, targetPoints - totalAvailablePoints);
  const withBonuses = totalAvailablePoints + totalSignupBonuses;
  const shortfallWithBonuses = Math.max(0, targetPoints - withBonuses);

  const calculateSpendingNeeded = (card: CreditCard, pointsNeeded: number) => {
    return Math.ceil(pointsNeeded / card.pointsPerDollar);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <Calculator className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Points Calculator</h2>
          <p className="text-gray-600">Calculate what you need for your dream trip</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Points Needed
            </label>
            <input
              type="number"
              value={targetPoints}
              onChange={(e) => setTargetPoints(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="170000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Based on business class flights to India
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Current Situation</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Points Total:</span>
                <span className="font-semibold text-green-600">
                  {totalAvailablePoints.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Available Bonuses:</span>
                <span className="font-semibold text-blue-600">
                  {totalSignupBonuses.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-sm font-medium text-gray-700">Potential Total:</span>
                <span className="font-bold text-lg text-purple-600">
                  {withBonuses.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {shortfall > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Points Shortfall</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-yellow-700">Current Shortfall:</span>
                  <span className="font-semibold text-yellow-800">
                    {shortfall.toLocaleString()} points
                  </span>
                </div>
                {shortfallWithBonuses > 0 ? (
                  <div className="flex justify-between">
                    <span className="text-sm text-yellow-700">After Bonuses:</span>
                    <span className="font-semibold text-yellow-800">
                      {shortfallWithBonuses.toLocaleString()} points
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Enough with signup bonuses!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Optimization Strategies</h3>
          
          {cards.map((card) => (
            <div key={card.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${card.color}`}></div>
                  <span className="font-medium">{card.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {card.currentPoints.toLocaleString()} pts
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                {card.signupBonus > 0 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <ArrowRight className="h-3 w-3" />
                    <span>Get {card.signupBonus.toLocaleString()} bonus points</span>
                  </div>
                )}
                
                {shortfallWithBonuses > 0 && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <ArrowRight className="h-3 w-3" />
                    <span>
                      Spend ${calculateSpendingNeeded(card, shortfallWithBonuses).toLocaleString()} 
                      to earn remaining points
                    </span>
                  </div>
                )}
                
                {card.transferPartners.length > 0 && (
                  <div className="flex items-center space-x-2 text-purple-600">
                    <ArrowRight className="h-3 w-3" />
                    <span>Transfer to {card.transferPartners[0]}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {shortfall === 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <Target className="h-5 w-5" />
                <span className="font-semibold">Goal Achieved!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                You have enough points for your business class flight to India.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointsCalculator;