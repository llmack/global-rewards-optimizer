import React from 'react';
import { Destination } from '../types';
import { MapPin, Star, Calendar, Thermometer } from 'lucide-react';

interface DestinationGuideProps {
  destinations: Destination[];
}

const DestinationGuide: React.FC<DestinationGuideProps> = ({ destinations }) => {
  const getWeatherInfo = (city: string) => {
    const weather = {
      'Mumbai': { temp: '77-86°F', description: 'Warm and humid, dry season' },
      'Delhi': { temp: '45-70°F', description: 'Cool and pleasant, best weather' },
      'Bangalore': { temp: '60-80°F', description: 'Mild and comfortable' },
      'Kochi': { temp: '75-88°F', description: 'Warm, tropical, dry season' },
      'Goa': { temp: '70-90°F', description: 'Perfect beach weather, dry season' }
    };
    return weather[city as keyof typeof weather] || { temp: '70-85°F', description: 'Pleasant weather' };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <MapPin className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">India Destinations Guide</h2>
          <p className="text-gray-600">Perfect destinations for January travel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {destinations.map((destination, index) => {
          const weather = getWeatherInfo(destination.city);
          
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {destination.city}
                  </h3>
                  <p className="text-sm text-gray-600">{destination.region}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">{destination.airport}</div>
                  <div className="flex items-center space-x-1 text-xs text-yellow-600">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Top destination</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700">January Weather</span>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Thermometer className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">{weather.temp}</span>
                  </div>
                  <p className="text-xs text-blue-800">{weather.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Must-See Highlights</h4>
                  <div className="flex flex-wrap gap-1">
                    {destination.highlights.map((highlight, highlightIndex) => (
                      <span
                        key={highlightIndex}
                        className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Flight availability: 
                    <span className="ml-1 font-medium text-green-600">
                      {destination.city === 'Mumbai' || destination.city === 'Delhi' ? 'Excellent' : 'Good'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>January Travel Advantages</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <ul className="text-green-800 space-y-1">
            <li>• Peak tourist season with perfect weather</li>
            <li>• Dry season across most of India</li>
            <li>• Festivals: Makar Sankranti, Republic Day</li>
          </ul>
          <ul className="text-blue-800 space-y-1">
            <li>• Best flight award availability</li>
            <li>• Cooler temperatures in north India</li>
            <li>• Perfect time for Golden Triangle tour</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DestinationGuide;