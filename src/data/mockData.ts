import { CreditCard, TransferPartner, FlightRoute, Destination } from '../types';

export const availableCreditCards: CreditCard[] = [
  {
    id: '1',
    name: 'Venture X',
    bank: 'Capital One',
    currentPoints: 0,
    annualFee: 395,
    signupBonus: 100000,
    pointsPerDollar: 2,
    transferPartners: ['Turkish Airlines', 'Air France', 'British Airways'],
    color: 'from-red-600 to-red-800',
    type: 'travel',
    description: 'Premium travel rewards card with 2x points on all purchases',
    bonusCategories: ['All purchases', 'Travel', 'Hotels'],
    minSpendRequirement: 4000,
    bonusTimeframe: '3 months'
  },
  {
    id: '2',
    name: 'Amazon Prime Visa',
    bank: 'Chase',
    currentPoints: 0,
    annualFee: 0,
    signupBonus: 0,
    pointsPerDollar: 1,
    transferPartners: [],
    color: 'from-blue-600 to-blue-800',
    type: 'cashback',
    description: 'No annual fee card with Amazon benefits',
    bonusCategories: ['Amazon', 'Whole Foods', 'Gas stations']
  },
  {
    id: '3',
    name: 'Gold Card',
    bank: 'American Express',
    currentPoints: 0,
    annualFee: 250,
    signupBonus: 90000,
    pointsPerDollar: 1,
    transferPartners: ['Delta', 'British Airways', 'Air France', 'Singapore Airlines'],
    color: 'from-yellow-500 to-yellow-700',
    type: 'travel',
    description: '4x points on dining and supermarkets, excellent transfer partners',
    bonusCategories: ['Dining', 'Supermarkets', 'Travel'],
    minSpendRequirement: 6000,
    bonusTimeframe: '6 months'
  },
  {
    id: '4',
    name: 'Alaska Airlines Visa',
    bank: 'Bank of America',
    currentPoints: 0,
    annualFee: 75,
    signupBonus: 60000,
    pointsPerDollar: 1,
    transferPartners: ['Alaska Airlines'],
    color: 'from-green-600 to-green-800',
    type: 'airline',
    description: 'Great for West Coast travelers and Alaska/Oneworld partners',
    bonusCategories: ['Alaska Airlines', 'Gas stations', 'EV charging'],
    minSpendRequirement: 2000,
    bonusTimeframe: '90 days'
  },
  {
    id: '5',
    name: 'Delta SkyMiles Gold',
    bank: 'American Express',
    currentPoints: 0,
    annualFee: 150,
    signupBonus: 70000,
    pointsPerDollar: 2,
    transferPartners: ['Delta'],
    color: 'from-indigo-600 to-indigo-800',
    type: 'airline',
    description: 'Delta co-brand with priority boarding and free checked bags',
    bonusCategories: ['Delta purchases', 'Dining', 'Supermarkets'],
    minSpendRequirement: 3000,
    bonusTimeframe: '3 months'
  },
  {
    id: '6',
    name: 'Sapphire Preferred',
    bank: 'Chase',
    currentPoints: 0,
    annualFee: 95,
    signupBonus: 80000,
    pointsPerDollar: 1,
    transferPartners: ['United', 'Southwest', 'British Airways', 'Air France', 'Singapore Airlines'],
    color: 'from-blue-700 to-blue-900',
    type: 'travel',
    description: 'Popular travel card with great transfer partners and dining rewards',
    bonusCategories: ['Travel', 'Dining'],
    minSpendRequirement: 4000,
    bonusTimeframe: '3 months'
  },
  {
    id: '7',
    name: 'Platinum Card',
    bank: 'American Express',
    currentPoints: 0,
    annualFee: 695,
    signupBonus: 150000,
    pointsPerDollar: 1,
    transferPartners: ['Delta', 'British Airways', 'Air France', 'Singapore Airlines', 'ANA'],
    color: 'from-gray-600 to-gray-800',
    type: 'travel',
    description: 'Premium card with extensive travel benefits and lounge access',
    bonusCategories: ['Flights', 'Hotels', 'Prepaid hotels'],
    minSpendRequirement: 8000,
    bonusTimeframe: '6 months'
  },
  {
    id: '8',
    name: 'United Explorer',
    bank: 'Chase',
    currentPoints: 0,
    annualFee: 95,
    signupBonus: 80000,
    pointsPerDollar: 1,
    transferPartners: ['United'],
    color: 'from-blue-800 to-blue-900',
    type: 'airline',
    description: 'United co-brand with free checked bags and priority boarding',
    bonusCategories: ['United purchases', 'Dining', 'Hotels'],
    minSpendRequirement: 3000,
    bonusTimeframe: '3 months'
  }
];

export const transferPartners: TransferPartner[] = [
  {
    id: '1',
    name: 'Singapore Airlines',
    type: 'airline',
    transferRatio: '1:1',
    bonusPromo: {
      ratio: '1:1.25',
      endDate: '2025-03-31',
      description: '25% bonus on transfers until March 31, 2025'
    },
    logo: '✈️',
    description: 'Premium Asian carrier with excellent business and first class products',
    bestFor: ['Premium cabin awards to Asia', 'Round-the-world tickets', 'Star Alliance partners']
  },
  {
    id: '2',
    name: 'Air France',
    type: 'airline',
    transferRatio: '1:1',
    logo: '🇫🇷',
    description: 'SkyTeam alliance member with good European and African coverage',
    bestFor: ['Europe flights', 'Africa connections', 'SkyTeam partners']
  },
  {
    id: '3',
    name: 'British Airways',
    type: 'airline',
    transferRatio: '1:1',
    logo: '🇬🇧',
    description: 'Oneworld member with distance-based award chart',
    bestFor: ['Short-haul flights', 'Off-peak awards', 'Oneworld partners']
  },
  {
    id: '4',
    name: 'Turkish Airlines',
    type: 'airline',
    transferRatio: '1:1',
    bonusPromo: {
      ratio: '1:1.6',
      endDate: '2025-02-29',
      description: '60% bonus on transfers - limited time offer!'
    },
    logo: '🇹🇷',
    description: 'Star Alliance member with extensive route network via Istanbul',
    bestFor: ['Europe to Asia connections', 'Middle East', 'Africa']
  },
  {
    id: '5',
    name: 'Delta',
    type: 'airline',
    transferRatio: '1:1',
    logo: '🛫',
    description: 'Major US carrier with SkyTeam alliance partnerships',
    bestFor: ['Domestic US flights', 'SkyTeam partners', 'Premium cabin upgrades']
  },
  {
    id: '6',
    name: 'United Airlines',
    type: 'airline',
    transferRatio: '1:1',
    logo: '🛫',
    description: 'Star Alliance member with extensive domestic and international network',
    bestFor: ['Star Alliance partners', 'Domestic US flights', 'Excursionist perk']
  }
];

export const indianDestinations: Destination[] = [
  {
    city: 'Mumbai',
    country: 'India',
    airport: 'BOM',
    region: 'Western India',
    highlights: ['Bollywood', 'Gateway of India', 'Marine Drive']
  },
  {
    city: 'Delhi',
    country: 'India',
    airport: 'DEL',
    region: 'Northern India',
    highlights: ['Red Fort', 'India Gate', 'Chandni Chowk']
  },
  {
    city: 'Bangalore',
    country: 'India',
    airport: 'BLR',
    region: 'Southern India',
    highlights: ['Tech Hub', 'Lalbagh Gardens', 'Cubbon Park']
  },
  {
    city: 'Kochi',
    country: 'India',
    airport: 'COK',
    region: 'Southern India',
    highlights: ['Backwaters', 'Fort Kochi', 'Spice Markets']
  },
  {
    city: 'Goa',
    country: 'India',
    airport: 'GOI',
    region: 'Western India',
    highlights: ['Beaches', 'Portuguese Architecture', 'Nightlife']
  }
];

export const flightRoutes: FlightRoute[] = [
  {
    id: '1',
    from: 'JFK',
    to: 'BOM',
    airline: 'Air France',
    date: '2025-01-15',
    returnDate: '2025-01-29',
    economyPoints: 85000,
    businessPoints: 170000,
    economyCash: 1200,
    businessCash: 4500,
    availability: 'good'
  },
  {
    id: '2',
    from: 'LAX',
    to: 'DEL',
    airline: 'Singapore Airlines',
    date: '2025-01-12',
    returnDate: '2025-01-26',
    economyPoints: 90000,
    businessPoints: 160000,
    economyCash: 1350,
    businessCash: 5200,
    availability: 'limited'
  },
  {
    id: '3',
    from: 'ORD',
    to: 'BLR',
    airline: 'Turkish Airlines',
    date: '2025-01-18',
    returnDate: '2025-02-01',
    economyPoints: 75000,
    businessPoints: 145000,
    economyCash: 1100,
    businessCash: 3900,
    availability: 'good'
  },
  {
    id: '4',
    from: 'PHL',
    to: 'COK',
    airline: 'British Airways',
    date: '2025-01-20',
    returnDate: '2025-02-03',
    economyPoints: 95000,
    businessPoints: 180000,
    economyCash: 1450,
    businessCash: 4800,
    availability: 'waitlist'
  }
];