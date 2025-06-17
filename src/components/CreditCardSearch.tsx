import React, { useState, useEffect } from 'react';
import { CreditCard } from '../types';
import { Search, Plus, Heart, Info, X } from 'lucide-react';
import { availableCreditCards } from '../data/mockData';
import { saveUserData, getUserData, trackEngagement } from '../utils/storage';

interface CreditCardSearchProps {
  onAddCard: (card: CreditCard) => void;
}

const CreditCardSearch: React.FC<CreditCardSearchProps> = ({ onAddCard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [savedCards, setSavedCards] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userData = getUserData();
    setSavedCards(userData.savedCards);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showModal]);

  const filteredCards = availableCreditCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.transferPartners.some(partner => 
      partner.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSaveCard = (cardId: string) => {
    trackEngagement({
      type: 'save',
      element: 'credit_card',
      metadata: { cardId }
    });

    const newSavedCards = savedCards.includes(cardId)
      ? savedCards.filter(id => id !== cardId)
      : [...savedCards, cardId];
    
    setSavedCards(newSavedCards);
    saveUserData({ savedCards: newSavedCards });
  };

  const handleCardClick = (card: CreditCard) => {
    trackEngagement({
      type: 'click',
      element: 'credit_card_details',
      metadata: { cardId: card.id, cardName: card.name }
    });
    
    setSelectedCard(card);
    setShowModal(true);
  };

  const handleAddCard = (card: CreditCard) => {
    trackEngagement({
      type: 'click',
      element: 'add_credit_card',
      metadata: { cardId: card.id, cardName: card.name }
    });
    
    onAddCard(card);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCard(null);
  };

  const formatPoints = (points: number) => points.toLocaleString();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <Search className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Find Credit Cards</h2>
          <p className="text-gray-600">Search for cards with signup bonuses and airline partnerships</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by card name, bank, or airline partner..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              trackEngagement({
                type: 'search',
                element: 'credit_card_search',
                metadata: { query: e.target.value }
              });
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{card.name}</h3>
                <p className="text-sm text-gray-600">{card.bank}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveCard(card.id);
                  }}
                  className={`p-1 rounded-full transition-colors ${
                    savedCards.includes(card.id)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${savedCards.includes(card.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleCardClick(card)}
                  className="p-1 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {card.signupBonus > 0 && (
                <div className="bg-green-50 p-2 rounded text-sm">
                  <span className="font-semibold text-green-800">
                    {formatPoints(card.signupBonus)} bonus points
                  </span>
                  {card.minSpendRequirement && (
                    <div className="text-green-600 text-xs">
                      Spend ${card.minSpendRequirement.toLocaleString()} in {card.bonusTimeframe}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Annual Fee:</span>
                <span className="font-medium">${card.annualFee}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Earn Rate:</span>
                <span className="font-medium">{card.pointsPerDollar}x points</span>
              </div>

              {card.transferPartners.length > 0 && (
                <div className="text-xs text-gray-500">
                  Partners: {card.transferPartners.slice(0, 2).join(', ')}
                  {card.transferPartners.length > 2 && ` +${card.transferPartners.length - 2} more`}
                </div>
              )}
            </div>

            <button
              onClick={() => handleAddCard(card)}
              className="w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Portfolio</span>
            </button>
          </div>
        ))}
      </div>

      {/* Card Details Modal */}
      {showModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCard.name}</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Close (ESC)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className={`bg-gradient-to-r ${selectedCard.color} p-6 rounded-lg text-white mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedCard.name}</h3>
                    <p className="opacity-90">{selectedCard.bank}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">Annual Fee</div>
                    <div className="text-2xl font-bold">${selectedCard.annualFee}</div>
                  </div>
                </div>
                
                {selectedCard.signupBonus > 0 && (
                  <div className="bg-white/20 p-3 rounded-lg">
                    <div className="text-lg font-bold">{formatPoints(selectedCard.signupBonus)} Bonus Points</div>
                    {selectedCard.minSpendRequirement && (
                      <div className="text-sm opacity-90">
                        Spend ${selectedCard.minSpendRequirement.toLocaleString()} in {selectedCard.bonusTimeframe}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedCard.description}</p>
                </div>

                {selectedCard.bonusCategories && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Bonus Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCard.bonusCategories.map((category, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCard.transferPartners.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Transfer Partners</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCard.transferPartners.map((partner, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => handleAddCard(selectedCard)}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add to Portfolio</span>
                  </button>
                  <button
                    onClick={() => handleSaveCard(selectedCard.id)}
                    className={`px-6 py-3 rounded-lg border transition-colors flex items-center space-x-2 ${
                      savedCards.includes(selectedCard.id)
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${savedCards.includes(selectedCard.id) ? 'fill-current' : ''}`} />
                    <span>{savedCards.includes(selectedCard.id) ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCardSearch;