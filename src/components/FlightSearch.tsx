import React, { useState } from 'react';
import { FlightRoute } from '../types';
import { Search, Plane, Calendar, MapPin, TrendingUp, Star, Heart } from 'lucide-react';
import { airports, searchAirports } from '../data/airports';
import { saveUserData, getUserData, trackEngagement } from '../utils/storage';

interface FlightSearchProps {
  routes: FlightRoute[];
}

const FlightSearch: React.FC<FlightSearchProps> = ({ routes }) => {
  const [fromCity, setFromCity] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState<typeof airports>([]);
  const [toCity, setToCity] = useState('');
  const [toSuggestions, setToSuggestions] = useState<typeof airports>([]);
  const [selectedRoute, setSelectedRoute] = useState<FlightRoute | null>(null);
  const [savedFlights, setSavedFlights] = useState<string[]>([]);
  const [travelDate, setTravelDate] = useState('');

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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Plane className="h-5 w-5" />
          <span>Available Routes to India</span>
        </h3>
        
        {routes.map((route) => (
          <div
            key={route.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedRoute(route);
              trackEngagement({
                type: 'click',
                element: 'flight_route_details',
                metadata: { routeId: route.id, from: route.from, to: route.to }
              });
            }}
          >
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
            
            <div className="grid grid-cols-2 gap-4">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightSearch;