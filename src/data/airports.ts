import { Airport } from '../types';

export const airports: Airport[] = [
  // US Major Airports
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'USA' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA' },
  { code: 'PHL', name: 'Philadelphia International', city: 'Philadelphia', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA' },
  { code: 'ORD', name: 'Chicago O\'Hare International', city: 'Chicago', country: 'USA' },
  { code: 'MDW', name: 'Chicago Midway International', city: 'Chicago', country: 'USA' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta', country: 'USA' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA' },
  { code: 'LAS', name: 'McCarran International', city: 'Las Vegas', country: 'USA' },
  { code: 'PHX', name: 'Phoenix Sky Harbor International', city: 'Phoenix', country: 'USA' },
  { code: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit', country: 'USA' },
  { code: 'MSP', name: 'Minneapolis-St. Paul International', city: 'Minneapolis', country: 'USA' },
  { code: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte', country: 'USA' },
  
  // India Airports
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India' },
  { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India' },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', country: 'India' },
  { code: 'COK', name: 'Cochin International', city: 'Kochi', country: 'India' },
  { code: 'GOI', name: 'Goa International', city: 'Goa', country: 'India' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', country: 'India' },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India' },
  { code: 'JAI', name: 'Jaipur International', city: 'Jaipur', country: 'India' },
  { code: 'LKO', name: 'Chaudhary Charan Singh International', city: 'Lucknow', country: 'India' },
  { code: 'IXC', name: 'Chandigarh Airport', city: 'Chandigarh', country: 'India' },
  { code: 'TRV', name: 'Trivandrum International', city: 'Thiruvananthapuram', country: 'India' },
  { code: 'IXM', name: 'Madurai Airport', city: 'Madurai', country: 'India' }
];

export const searchAirports = (query: string): Airport[] => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  
  return airports.filter(airport => 
    airport.code.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.city.toLowerCase().includes(searchTerm)
  ).slice(0, 10);
};