import React, { useState } from 'react';
import { FlightRoute, CreditCard, LoyaltyProgram, TransferOption, TransferRecommendation } from '../types';
import { Search, Plane, Calendar, MapPin, TrendingUp, Star, Heart, CreditCard as CreditCardIcon, ArrowRight, Lightbulb, Target } from 'lucide-react';
import { airports, searchAirports } from '../data/airports';
import { saveUserData, getUserData, trackEngagement } from '../utils/storage';

interface FlightSearchProps {
  routes: FlightRoute[];
  userCards?: CreditCard[];
  userPrograms?: LoyaltyProgram[];
}

const FlightSearch: React.FC<FlightSearchProps> = ({ routes, userCards = [], userPrograms = [] }) => {
  const [fromCity, setFromCity] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<typeof airports>([]);
  const [toCity, setToCity] = useState('');
  const [toSuggestions, setToSuggestions] = useState<typeof airports>([]);
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null);
  const [savedFlights, setSavedFlights] = useState<string[]>([]);
  const [travelDate, setTravelDate] = useState('');
  const [showTransferAnalysis, setShowTransferAnalysis] = useState<string | null>(null);

  React.useEffect(() => {
    const userData = getUserData();
    setSavedFlights(userData.savedFlights);
    
    // Set default date to today
    const today = new Date();
    setTravelDate(today.toISOString().split('T')[0]);
  }, []);

  const formatPoints = (points: number) => points.toLocaleString();
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'limited':
        return 'text-yellow-600 bg-yellow-100';
      case 'waitlist':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateValue = (points: number, cash: number) => {
    return ((cash / points) * 100).toFixed(2);
  };

  // Enhanced transfer calculation with detailed analysis
  const calculateTransferOptions = (route: FlightRoute, cabin: 'economy' | 'business'): TransferOption[] => {
    const pointsNeeded = cabin === 'economy' ? route.economyPoints : route.businessPoints;
    const options: TransferOption[] = [];

    // Process credit cards
    userCards.forEach(card => {
      const availablePoints = card.currentPoints || 0;
      const signupBonus = card.signupBonus || 0;
      const totalPotentialPoints = availablePoints + signupBonus;
      
      // Check if this card can transfer to the route's airline
      const canTransfer = card.transferPartners.some(partner => 
        partner.toLowerCase().includes(route.airline.toLowerCase()) ||
        route.airline.toLowerCase().includes(partner.toLowerCase()) ||
        // Enhanced transfer partner matching
        (route.airline === 'Air France' && ['Air France', 'Flying Blue'].some(p => partner.includes(p))) ||
        (route.airline === 'British Airways' && ['British Airways', 'Avios'].some(p => partner.includes(p))) ||
        (route.airline === 'Singapore Airlines' && partner.includes('Singapore')) ||
        (route.airline === 'Turkish Airlines' && partner.includes('Turkish')) ||
        (route.airline === 'Delta' && partner.includes('Delta')) ||
        (route.airline === 'United Airlines' && partner.includes('United'))
      );

      if (canTransfer || availablePoints > 0) {
        const transferRatio = '1:1'; // Most credit card transfers are 1:1
        const finalMiles = availablePoints; // 1:1 transfer
        const pointsShortfall = Math.max(0, pointsNeeded - availablePoints);
        const canAffordWithBonus = totalPotentialPoints >= pointsNeeded;
        const canAffordNow = availablePoints >= pointsNeeded;

        options.push({
          card,
          canTransfer,
          availablePoints,
          signupBonus,
          totalPotentialPoints,
          pointsNeeded,
          pointsShortfall,
          canAffordNow,
          canAffordWithBonus,
          coveragePercentage: Math.min(100, (availablePoints / pointsNeeded) * 100),
          transferRatio,
          finalMiles
        });
      }
    });

    // Process loyalty programs
    userPrograms.forEach(program => {
      const availableMiles = program.currentMiles || 0;
      
      // Check if this program can be used for the route
      const canTransfer = 
        program.airline.toLowerCase().includes(route.airline.toLowerCase()) ||
        route.airline.toLowerCase().includes(program.airline.toLowerCase()) ||
        program.partners.some(partner => 
          partner.toLowerCase().includes(route.airline.toLowerCase()) ||
          route.airline.toLowerCase().includes(partner.toLowerCase())
        );

      if (canTransfer || availableMiles > 0) {
        const transferRatio = '1:1'; // Most airline-to-airline transfers are 1:1
        const finalMiles = availableMiles;
        const pointsShortfall = Math.max(0, pointsNeeded - availableMiles);
        const canAffordNow = availableMiles >= pointsNeeded;

        options.push({
          program,
          canTransfer,
          availablePoints: availableMiles,
          signupBonus: 0,
          totalPotentialPoints: availableMiles,
          pointsNeeded,
          pointsShortfall,
          canAffordNow,
          canAffordWithBonus: canAffordNow,
          coveragePercentage: Math.min(100, (availableMiles / pointsNeeded) * 100),
          transferRatio,
          finalMiles
        });
      }
    });

    return options.sort((a, b) => b.coveragePercentage - a.coveragePercentage);
  };

  // Generate smart recommendations
  const generateRecommendations = (route: FlightRoute, cabin: 'economy' | 'business'): TransferRecommendation[] => {
    const pointsNeeded = cabin === 'economy' ? route.economyPoints : route.businessPoints;
    const options = calculateTransferOptions(route, cabin);
    const totalAvailable = options.reduce((sum, opt) => sum + opt.availablePoints, 0);
    const shortfall = Math.max(0, pointsNeeded - totalAvailable);
    
    const recommendations: TransferRecommendation[] = [];

    if (shortfall > 0) {
      // Recommend credit cards that transfer to this airline
      if (route.airline === 'Air France') {
        recommendations.push({
          type: 'credit_card',
          name: 'Chase Sapphire Preferred',
          description: 'Transfers 1:1 to Air France Flying Blue, 80K signup bonus',
          pointsNeeded: Math.min(shortfall, 80000),
          estimatedValue: '2.1¢/point',
          difficulty: 'easy'
        });
      }
      
      if (route.airline === 'Singapore Airlines') {
        recommendations.push({
          type: 'credit_card',
          name: 'American Express Gold',
          description: 'Transfers 1:1 to Singapore KrisFlyer, 90K signup bonus',
          pointsNeeded: Math.min(shortfall, 90000),
          estimatedValue: '2.8¢/point',
          difficulty: 'medium'
        });
      }

      if (route.airline === 'Turkish Airlines') {
        recommendations.push({
          type: 'credit_card',
          name: 'Capital One Venture X',
          description: 'Transfers 1:1.6 to Turkish Miles&Smiles (60% bonus until Feb 29)',
          pointsNeeded: Math.min(shortfall, 100000),
          estimatedValue: '3.2¢/point',
          difficulty: 'easy'
        });
      }

      // Recommend partner programs
      recommendations.push({
        type: 'loyalty_program',
        name: `${route.airline} Loyalty Program`,
        description: `Sign up for ${route.airline} frequent flyer program and earn miles through flights`,
        pointsNeeded: shortfall,
        estimatedValue: '1.5¢/mile',
        difficulty: 'hard'
      });
    }

    return recommendations.slice(0, 3);
  };

  const handleFromSearch = (query: string) => {
    setFromCity(query);
    if (query.length >= 2) {
      const suggestions = searchAirports(query);
      setFromSuggestions(suggestions);
      
      trackEngagement({
        type: 'search',
        element: 'flight_from_airport',
        metadata: { query }
      });
    } else {
      setFromSuggestions([]);
    }
  };

  const handleToSearch = (query: string) => {
    setToCity(query);
    if (query.length >= 2) {
      const suggestions = searchAirports(query);
      setToSuggestions(suggestions);
      
      trackEngagement({
        type: 'search',
        element: 'flight_to_airport',
        metadata: { query }
      });
    } else {
      setToSuggestions([]);
    }
  };

  const handleSaveFlight = (flightId: string) => {
    trackEngagement({
      type: 'save',
      element: 'flight_route',
      metadata: { flightId }
    });

    const newSavedFlights = savedFlights.includes(flightId)
      ? savedFlights.filter(id => id !== flightId)
      : [...savedFlights, flightId];
    
    setSavedFlights(newSavedFlights);
    saveUserData({ savedFlights: newSavedFlights });
  };

  const handleSearchFlights = () => {
    trackEngagement({
      type: 'click',
      element: 'search_flights_philadelphia',
      metadata: { from: fromCity, to: toCity, date: travelDate }
    });
    
    console.log('Searching flights from Philadelphia area to India');
  };

  const toggleTransferAnalysis = (routeId: string) => {
    setShowTransferAnalysis(showTransferAnalysis === routeId ? null : routeId);
    
    trackEngagement({
      type: 'click',
      element: 'toggle_transfer_analysis',
      metadata: { routeId }
    });
  };

  const getMaxDate = () => {
    const today = new Date();
    const oneYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    return oneYearFromNow.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Search className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Flight Search & Analysis</h2>
          <p className="text-gray-600">Find the best redemption values to India</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From (Airport/City)
          </label>
          <input
            type="text"
            value={fromCity}
            onChange={(e) => handleFromSearch(e.target.value)}
            placeholder="PHL, Philadelphia, JFK..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {fromSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {fromSuggestions.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => {
                    setFromCity(`${airport.code} - ${airport.city}`);
                    setFromSuggestions([]);
                    trackEngagement({
                      type: 'click',
                      element: 'airport_selection',
                      metadata: { airport: airport.code, city: airport.city }
                    });
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{airport.code} - {airport.city}</div>
                  <div className="text-sm text-gray-600">{airport.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To (Airport/City)
          </label>
          <input
            type="text"
            value={toCity}
            onChange={(e) => handleToSearch(e.target.value)}
            placeholder="BOM, Mumbai, DEL..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {toSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {toSuggestions.map((airport) => (
                <button
                  key={airport.code}
                  onClick={() => {
                    setToCity(`${airport.code} - ${airport.city}`);
                    setToSuggestions([]);
                    trackEngagement({
                      type: 'click',
                      element: 'airport_selection',
                      metadata: { airport: airport.code, city: airport.city }
                    });
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{airport.code} - {airport.city}</div>
                  <div className="text-sm text-gray-600">{airport.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Date
          </label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleSearchFlights}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="h-5 w-5" />
          <span>Search Flights from Philadelphia Area</span>
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Plane className="h-5 w-5" />
          <span>Available Routes from Philadelphia Area</span>
        </h3>
        
        {routes.map((route) => {
          const economyTransferOptions = calculateTransferOptions(route, 'economy');
          const businessTransferOptions = calculateTransferOptions(route, 'business');
          const economyRecommendations = generateRecommendations(route, 'economy');
          const businessRecommendations = generateRecommendations(route, 'business');
          const showAnalysis = showTransferAnalysis === route.id;
          
          return (
            <div key={route.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold">{route.from} → {route.to}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{route.date}</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">{route.airline}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(route.availability)}`}>
                      {route.availability}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveFlight(route.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        savedFlights.includes(route.id)
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${savedFlights.includes(route.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Economy</div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">{formatPoints(route.economyPoints)} pts</span>
                      <span className="text-sm text-gray-500">or {formatCurrency(route.economyCash)}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">
                        {calculateValue(route.economyPoints, route.economyCash)}¢/point
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-200">
                    <div className="text-sm text-gray-600 mb-1 flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>Business Class</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">{formatPoints(route.businessPoints)} pts</span>
                      <span className="text-sm text-gray-500">or {formatCurrency(route.businessCash)}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">
                        {calculateValue(route.businessPoints, route.businessCash)}¢/point
                      </span>
                    </div>
                  </div>
                </div>

                {(userCards.length > 0 || userPrograms.length > 0) && (
                  <button
                    onClick={() => toggleTransferAnalysis(route.id)}
                    className="w-full bg-purple-50 border border-purple-200 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                    <span>{showAnalysis ? 'Hide' : 'Show'} Your Points Analysis</span>
                    <ArrowRight className={`h-4 w-4 transition-transform ${showAnalysis ? 'rotate-90' : ''}`} />
                  </button>
                )}
              </div>

              {/* Enhanced Transfer Analysis Panel */}
              {showAnalysis && (userCards.length > 0 || userPrograms.length > 0) && (
                <div className="border-t border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <CreditCardIcon className="h-5 w-5 text-purple-600" />
                    <span>Your Points & Miles Analysis</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Economy Analysis */}
                    <div>
                      <h5 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>Economy Class ({formatPoints(route.economyPoints)} pts needed)</span>
                      </h5>
                      
                      <div className="space-y-3 mb-4">
                        {economyTransferOptions.map((option, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                                  option.card ? option.card.color : option.program?.color
                                }`}></div>
                                <span className="font-medium text-sm">
                                  {option.card ? option.card.name : option.program?.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({option.card ? 'Credit Card' : 'Loyalty Program'})
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                  {formatPoints(option.availablePoints)} {option.card ? 'pts' : 'miles'}
                                </div>
                                {option.signupBonus > 0 && (
                                  <div className="text-xs text-green-600">
                                    +{formatPoints(option.signupBonus)} bonus
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {option.canTransfer && (
                                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  Transfer ratio: {option.transferRatio} → {formatPoints(option.finalMiles)} miles
                                </div>
                              )}
                              
                              {option.canAffordNow ? (
                                <div className="flex items-center space-x-2 text-green-600">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-xs font-medium">✅ Can book now!</span>
                                </div>
                              ) : option.canAffordWithBonus ? (
                                <div className="flex items-center space-x-2 text-blue-600">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-xs font-medium">🎯 Can book with signup bonus</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 text-orange-600">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span className="text-xs font-medium">
                                    ⚠️ Need {formatPoints(option.pointsShortfall)} more points
                                  </span>
                                </div>
                              )}
                              
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(100, option.coveragePercentage)}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-600">
                                {option.coveragePercentage.toFixed(0)}% coverage
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Economy Recommendations */}
                      {economyRecommendations.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <h6 className="font-medium text-yellow-800 mb-2 flex items-center space-x-1">
                            <Lightbulb className="h-4 w-4" />
                            <span>Recommendations to Complete Booking</span>
                          </h6>
                          <div className="space-y-2">
                            {economyRecommendations.map((rec, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium text-yellow-900">{rec.name}</div>
                                <div className="text-yellow-700">{rec.description}</div>
                                <div className="text-xs text-yellow-600">
                                  Value: {rec.estimatedValue} • Difficulty: {rec.difficulty}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Business Analysis */}
                    <div>
                      <h5 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>Business Class ({formatPoints(route.businessPoints)} pts needed)</span>
                      </h5>
                      
                      <div className="space-y-3 mb-4">
                        {businessTransferOptions.map((option, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                                  option.card ? option.card.color : option.program?.color
                                }`}></div>
                                <span className="font-medium text-sm">
                                  {option.card ? option.card.name : option.program?.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({option.card ? 'Credit Card' : 'Loyalty Program'})
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">
                                  {formatPoints(option.availablePoints)} {option.card ? 'pts' : 'miles'}
                                </div>
                                {option.signupBonus > 0 && (
                                  <div className="text-xs text-green-600">
                                    +{formatPoints(option.signupBonus)} bonus
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {option.canTransfer && (
                                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  Transfer ratio: {option.transferRatio} → {formatPoints(option.finalMiles)} miles
                                </div>
                              )}
                              
                              {option.canAffordNow ? (
                                <div className="flex items-center space-x-2 text-green-600">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-xs font-medium">✅ Can book now!</span>
                                </div>
                              ) : option.canAffordWithBonus ? (
                                <div className="flex items-center space-x-2 text-blue-600">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-xs font-medium">🎯 Can book with signup bonus</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2 text-orange-600">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span className="text-xs font-medium">
                                    ⚠️ Need {formatPoints(option.pointsShortfall)} more points
                                  </span>
                                </div>
                              )}
                              
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(100, option.coveragePercentage)}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-600">
                                {option.coveragePercentage.toFixed(0)}% coverage
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Business Recommendations */}
                      {businessRecommendations.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <h6 className="font-medium text-yellow-800 mb-2 flex items-center space-x-1">
                            <Lightbulb className="h-4 w-4" />
                            <span>Recommendations to Complete Booking</span>
                          </h6>
                          <div className="space-y-2">
                            {businessRecommendations.map((rec, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium text-yellow-900">{rec.name}</div>
                                <div className="text-yellow-700">{rec.description}</div>
                                <div className="text-xs text-yellow-600">
                                  Value: {rec.estimatedValue} • Difficulty: {rec.difficulty}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {economyTransferOptions.length === 0 && businessTransferOptions.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <CreditCardIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No compatible transfer partners found for this route.</p>
                      <p className="text-sm">Consider cards with {route.airline} partnerships.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlightSearch;