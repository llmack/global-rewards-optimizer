import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CreditCardGrid from './components/CreditCardGrid';
import CreditCardSearch from './components/CreditCardSearch';
import LoyaltyProgramSearch from './components/LoyaltyProgramSearch';
import LoyaltyProgramGrid from './components/LoyaltyProgramGrid';
import FlightSearch from './components/FlightSearch';
import PointsCalculator from './components/PointsCalculator';
import TransferPartners from './components/TransferPartners';
import DestinationGuide from './components/DestinationGuide';
import { 
  transferPartners, 
  generateFlightRoutes, 
  indianDestinations 
} from './data/mockData';
import { CreditCard, LoyaltyProgram } from './types';
import { getUserData, saveUserData } from './utils/storage';

function App() {
  const [userCards, setUserCards] = useState<CreditCard[]>([]);
  const [userPrograms, setUserPrograms] = useState<LoyaltyProgram[]>([]);

  useEffect(() => {
    // Load user's saved cards and programs on app start
    const userData = getUserData();
    // For demo purposes, start with empty portfolio
    // In a real app, you'd load the user's actual cards and programs
  }, []);

  const handleAddCard = (card: CreditCard) => {
    // Check if card is already in portfolio
    const existingCard = userCards.find(existingCard => existingCard.id === card.id);
    if (existingCard) {
      // Card already exists, don't add duplicate
      return;
    }
    
    const newCard = { ...card, isOwned: true };
    setUserCards(prev => [...prev, newCard]);
  };

  const handleRemoveCard = (cardId: string) => {
    setUserCards(prev => prev.filter(card => card.id !== cardId));
  };

  const handleUpdateCardPoints = (cardId: string, points: number) => {
    setUserCards(prev => 
      prev.map(card => 
        card.id === cardId ? { ...card, currentPoints: points } : card
      )
    );
  };

  const handleAddProgram = (program: LoyaltyProgram) => {
    // Check if program is already in portfolio
    const existingProgram = userPrograms.find(existingProgram => existingProgram.id === program.id);
    if (existingProgram) {
      // Program already exists, don't add duplicate
      return;
    }
    
    const newProgram = { ...program, isOwned: true };
    setUserPrograms(prev => [...prev, newProgram]);
  };

  const handleRemoveProgram = (programId: string) => {
    setUserPrograms(prev => prev.filter(program => program.id !== programId));
  };

  const handleUpdateProgramMiles = (programId: string, miles: number) => {
    setUserPrograms(prev => 
      prev.map(program => 
        program.id === programId ? { ...program, currentMiles: miles } : program
      )
    );
  };

  // Generate dynamic flight routes based on current date
  const eastCoastFlights = generateFlightRoutes().filter(route => 
    ['PHL', 'EWR', 'JFK', 'LGA'].includes(route.from)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <CreditCardSearch onAddCard={handleAddCard} />
          <LoyaltyProgramSearch onAddProgram={handleAddProgram} />
        </div>

        {(userCards.length > 0 || userPrograms.length > 0) && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Points & Miles Portfolio</h2>
              <p className="text-gray-600">Manage your cards, loyalty programs, and track available points</p>
            </div>
            
            <div className="space-y-8">
              {userCards.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Credit Cards</h3>
                  <CreditCardGrid 
                    cards={userCards} 
                    onUpdateCard={handleUpdateCardPoints}
                    onRemoveCard={handleRemoveCard}
                  />
                </div>
              )}
              
              {userPrograms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Airline Loyalty Programs</h3>
                  <LoyaltyProgramGrid 
                    programs={userPrograms} 
                    onUpdateProgram={handleUpdateProgramMiles}
                    onRemoveProgram={handleRemoveProgram}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <FlightSearch 
            routes={eastCoastFlights} 
            userCards={userCards} 
            userPrograms={userPrograms}
          />
          <DestinationGuide destinations={indianDestinations} />
        </div>

        {(userCards.length > 0 || userPrograms.length > 0) && (
          <PointsCalculator cards={userCards} programs={userPrograms} />
        )}

        <TransferPartners partners={transferPartners} />

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Ready to Book Your India Adventure?</h2>
          <p className="text-purple-100 mb-4">
            Start by adding your credit cards and airline loyalty programs, then enter your current points to see personalized recommendations.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => window.open('https://www.google.com/flights', '_blank')}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Search Award Flights
            </button>
            <button 
              onClick={() => window.open('https://www.google.com/flights', '_blank')}
              className="border border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Set Price Alerts
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;