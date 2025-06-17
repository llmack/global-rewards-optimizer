export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  currentPoints: number;
  annualFee: number;
  signupBonus: number;
  pointsPerDollar: number;
  transferPartners: string[];
  color: string;
  type: 'travel' | 'cashback' | 'airline' | 'hotel';
  isOwned?: boolean;
  isSaved?: boolean;
  description?: string;
  bonusCategories?: string[];
  minSpendRequirement?: number;
  bonusTimeframe?: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  airline: string;
  currentMiles: number;
  type: 'airline' | 'hotel';
  alliance: 'Star Alliance' | 'SkyTeam' | 'Oneworld' | 'None';
  partners: string[];
  color: string;
  description?: string;
  transferRatio?: string;
  isOwned?: boolean;
  isSaved?: boolean;
}

export interface FlightRoute {
  id: string;
  from: string;
  to: string;
  airline: string;
  date: string;
  returnDate?: string;
  economyPoints: number;
  businessPoints: number;
  economyCash: number;
  businessCash: number;
  availability: 'good' | 'limited' | 'waitlist';
  isSaved?: boolean;
}

export interface TransferPartner {
  id: string;
  name: string;
  type: 'airline' | 'hotel';
  transferRatio: string;
  bonusPromo?: {
    ratio: string;
    endDate: string;
    description?: string;
  };
  logo: string;
  description?: string;
  bestFor?: string[];
}

export interface Destination {
  city: string;
  country: string;
  airport: string;
  region: string;
  highlights: string[];
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface UserData {
  savedCards: string[];
  savedFlights: string[];
  savedPrograms: string[];
  cardPoints: Record<string, number>;
  programMiles: Record<string, number>;
  preferences: {
    preferredAirlines: string[];
    preferredCabins: string[];
  };
}

export interface EngagementEvent {
  type: 'click' | 'view' | 'save' | 'search';
  element: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface TransferOption {
  card?: CreditCard;
  program?: LoyaltyProgram;
  canTransfer: boolean;
  availablePoints: number;
  signupBonus: number;
  totalPotentialPoints: number;
  pointsNeeded: number;
  pointsShortfall: number;
  canAffordNow: boolean;
  canAffordWithBonus: boolean;
  coveragePercentage: number;
  transferRatio: string;
  finalMiles: number;
}

export interface TransferRecommendation {
  type: 'credit_card' | 'loyalty_program';
  name: string;
  description: string;
  pointsNeeded: number;
  estimatedValue: string;
  difficulty: 'easy' | 'medium' | 'hard';
}