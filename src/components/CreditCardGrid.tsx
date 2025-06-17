import React, { useState, useEffect } from 'react';
import { CreditCard as CreditCardType } from '../types';
import { CreditCard, TrendingUp, Gift, Edit3, Save, X } from 'lucide-react';
import { saveUserData, getUserData, trackEngagement } from '../utils/storage';

interface CreditCardGridProps {
  cards: CreditCardType[];
  onUpdateCard: (cardId: string, points: number) => void;
}

const CreditCardGrid: React.FC<CreditCardGridProps> = ({ cards, onUpdateCard }) => {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState<string>('');
  const [cardPoints, setCardPoints] = useState<Record<string, number>>({});

  useEffect(() => {
    const userData = getUserData();
    setCardPoints(userData.cardPoints);
  }, []);

  const formatPoints = (points: number) => {
    return points.toLocaleString();
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'travel':
        return '✈️';
      case 'airline':
        return '🛫';
      case 'hotel':
        return '🏨';
      default:
        return '💳';
    }
  };

  const handleEditPoints = (cardId: string, currentPoints: number) => {
    trackEngagement({
      type: 'click',
      element: 'edit_card_points',
      metadata: { cardId }
    });
    
    setEditingCard(cardId);
    setEditPoints(currentPoints.toString());
  };

  const handleSavePoints = (cardId: string) => {
    const points = parseInt(editPoints) || 0;
    
    trackEngagement({
      type: 'click',
      element: 'save_card_points',
      metadata: { cardId, points }
    });
    
    const newCardPoints = { ...cardPoints, [cardId]: points };
    setCardPoints(newCardPoints);
    saveUserData({ cardPoints: newCardPoints });
    onUpdateCard(cardId, points);
    setEditingCard(null);
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setEditPoints('');
  };

  const getDisplayPoints = (card: CreditCardType) => {
    return cardPoints[card.id] !== undefined ? cardPoints[card.id] : card.currentPoints;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => {
        const displayPoints = getDisplayPoints(card);
        const isEditing = editingCard === card.id;
        
        return (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`bg-gradient-to-r ${card.color} p-6 text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCardIcon(card.type)}</span>
                  <div>
                    <h3 className="font-bold text-lg">{card.name}</h3>
                    <p className="text-sm opacity-90">{card.bank}</p>
                  </div>
                </div>
                <CreditCard className="h-6 w-6 opacity-80" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Current Points</span>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={editPoints}
                          onChange={(e) => setEditPoints(e.target.value)}
                          className="w-24 px-2 py-1 text-black rounded text-sm"
                          placeholder="0"
                        />
                        <button
                          onClick={() => handleSavePoints(card.id)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-xl">{formatPoints(displayPoints)}</span>
                        <button
                          onClick={() => handleEditPoints(card.id, displayPoints)}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Earn Rate</span>
                  <span className="font-semibold">{card.pointsPerDollar}x points</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <Gift className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {card.signupBonus > 0 
                      ? `${formatPoints(card.signupBonus)} bonus available`
                      : 'No current bonus'
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {card.transferPartners.length} transfer partners
                  </span>
                </div>
                
                {card.annualFee > 0 && (
                  <div className="text-xs text-gray-500">
                    Annual Fee: ${card.annualFee}
                  </div>
                )}
                
                <div className="pt-2">
                  <div className="text-xs text-gray-500 mb-1">Transfer Partners</div>
                  <div className="flex flex-wrap gap-1">
                    {card.transferPartners.slice(0, 3).map((partner, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {partner}
                      </span>
                    ))}
                    {card.transferPartners.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{card.transferPartners.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CreditCardGrid;