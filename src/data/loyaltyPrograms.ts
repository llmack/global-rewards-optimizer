import { LoyaltyProgram } from '../types';

export const availableLoyaltyPrograms: LoyaltyProgram[] = [
  {
    id: 'alaska-mileage',
    name: 'Mileage Plan',
    airline: 'Alaska Airlines',
    currentMiles: 0,
    type: 'airline',
    alliance: 'Oneworld',
    partners: ['British Airways', 'American Airlines', 'Cathay Pacific', 'Japan Airlines', 'Qantas'],
    color: 'from-green-600 to-green-800',
    description: 'Alaska Airlines loyalty program with excellent Oneworld partnerships and unique routing rules',
    transferRatio: '1:1'
  },
  {
    id: 'british-airways-executive',
    name: 'Executive Club',
    airline: 'British Airways',
    currentMiles: 0,
    type: 'airline',
    alliance: 'Oneworld',
    partners: ['American Airlines', 'Alaska Airlines', 'Cathay Pacific', 'Japan Airlines', 'Qantas', 'Iberia'],
    color: 'from-blue-800 to-red-600',
    description: 'British Airways Avios program with distance-based awards and excellent short-haul value',
    transferRatio: '1:1'
  },
  {
    id: 'delta-skymiles',
    name: 'SkyMiles',
    airline: 'Delta Air Lines',
    currentMiles: 0,
    type: 'airline',
    alliance: 'SkyTeam',
    partners: ['Air France', 'KLM', 'Virgin Atlantic', 'Korean Air', 'China Eastern'],
    color: 'from-red-600 to-blue-600',
    description: 'Delta SkyMiles with SkyTeam alliance and Virgin Atlantic partnership',
    transferRatio: '1:1'
  },
  {
    id: 'united-mileageplus',
    name: 'MileagePlus',
    airline: 'United Airlines',
    currentMiles: 0,
    type: 'airline',
    alliance: 'Star Alliance',
    partners: ['Lufthansa', 'Singapore Airlines', 'ANA', 'Air Canada', 'Turkish Airlines'],
    color: 'from-blue-700 to-blue-900',
    description: 'United MileagePlus with extensive Star Alliance network and Excursionist perk',
    transferRatio: '1:1'
  },
  {
    id: 'american-aadvantage',
    name: 'AAdvantage',
    airline: 'American Airlines',
    currentMiles: 0,
    type: 'airline',
    alliance: 'Oneworld',
    partners: ['British Airways', 'Cathay Pacific', 'Japan Airlines', 'Qantas', 'Alaska Airlines'],
    color: 'from-red-700 to-gray-700',
    description: 'American Airlines AAdvantage with Oneworld alliance partnerships',
    transferRatio: '1:1'
  },
  {
    id: 'southwest-rapid-rewards',
    name: 'Rapid Rewards',
    airline: 'Southwest Airlines',
    currentMiles: 0,
    type: 'airline',
    alliance: 'None',
    partners: [],
    color: 'from-orange-500 to-blue-600',
    description: 'Southwest Rapid Rewards with no blackout dates and companion pass benefits',
    transferRatio: '1:1'
  },
  {
    id: 'jetblue-trueblue',
    name: 'TrueBlue',
    airline: 'JetBlue Airways',
    currentMiles: 0,
    type: 'airline',
    alliance: 'None',
    partners: ['Hawaiian Airlines', 'Icelandair'],
    color: 'from-blue-500 to-blue-700',
    description: 'JetBlue TrueBlue with no blackout dates and family pooling',
    transferRatio: '1:1'
  },
  {
    id: 'air-france-flying-blue',
    name: 'Flying Blue',
    airline: 'Air France-KLM',
    currentMiles: 0,
    type: 'airline',
    alliance: 'SkyTeam',
    partners: ['Delta', 'Virgin Atlantic', 'Korean Air', 'China Eastern'],
    color: 'from-blue-600 to-red-500',
    description: 'Air France-KLM Flying Blue with monthly promo awards and SkyTeam access',
    transferRatio: '1:1'
  },
  {
    id: 'singapore-krisflyer',
    name: 'KrisFlyer',
    airline: 'Singapore Airlines',
    currentMiles: 0,
    type: 'airline',
    alliance: 'Star Alliance',
    partners: ['United', 'Lufthansa', 'ANA', 'Air Canada', 'Turkish Airlines'],
    color: 'from-blue-800 to-yellow-600',
    description: 'Singapore Airlines KrisFlyer with premium cabin awards and Star Alliance access',
    transferRatio: '1:1'
  },
  {
    id: 'turkish-miles-smiles',
    name: 'Miles&Smiles',
    airline: 'Turkish Airlines',
    currentMiles: 0,
    type: 'airline',
    alliance: 'Star Alliance',
    partners: ['United', 'Lufthansa', 'Singapore Airlines', 'ANA', 'Air Canada'],
    color: 'from-red-600 to-red-800',
    description: 'Turkish Airlines Miles&Smiles with excellent award availability and Star Alliance network',
    transferRatio: '1:1'
  }
];

export const searchLoyaltyPrograms = (query: string): LoyaltyProgram[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  
  return availableLoyaltyPrograms.filter(program => 
    program.name.toLowerCase().includes(searchTerm) ||
    program.airline.toLowerCase().includes(searchTerm) ||
    program.alliance.toLowerCase().includes(searchTerm) ||
    program.partners.some(partner => 
      partner.toLowerCase().includes(searchTerm)
    )
  ).slice(0, 10);
};