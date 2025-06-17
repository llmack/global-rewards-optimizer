import { UserData, EngagementEvent } from '../types';

const STORAGE_KEY = 'travel_rewards_data';
const ENGAGEMENT_KEY = 'travel_rewards_engagement';

// Generate a unique anonymous user ID
const getUserId = (): string => {
  let userId = localStorage.getItem('travel_rewards_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('travel_rewards_user_id', userId);
  }
  return userId;
};

export const saveUserData = (data: Partial<UserData>): void => {
  try {
    const existingData = getUserData();
    const updatedData = { ...existingData, ...data };
    
    // Encrypt sensitive data (basic obfuscation for demo)
    const encryptedData = btoa(JSON.stringify(updatedData));
    localStorage.setItem(STORAGE_KEY, encryptedData);
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

export const getUserData = (): UserData => {
  try {
    const encryptedData = localStorage.getItem(STORAGE_KEY);
    if (!encryptedData) {
      return {
        savedCards: [],
        savedFlights: [],
        cardPoints: {},
        preferences: {
          preferredAirlines: [],
          preferredCabins: []
        }
      };
    }
    
    const decryptedData = atob(encryptedData);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Failed to load user data:', error);
    return {
      savedCards: [],
      savedFlights: [],
      cardPoints: {},
      preferences: {
        preferredAirlines: [],
        preferredCabins: []
      }
    };
  }
};

export const trackEngagement = (event: Omit<EngagementEvent, 'timestamp'>): void => {
  try {
    const userId = getUserId();
    const engagementEvent: EngagementEvent & { userId: string } = {
      ...event,
      userId,
      timestamp: Date.now()
    };
    
    const existingEvents = JSON.parse(localStorage.getItem(ENGAGEMENT_KEY) || '[]');
    existingEvents.push(engagementEvent);
    
    // Keep only last 1000 events to prevent storage bloat
    if (existingEvents.length > 1000) {
      existingEvents.splice(0, existingEvents.length - 1000);
    }
    
    localStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(existingEvents));
    
    // In a real app, you'd send this to your analytics service
    console.log('Engagement tracked:', engagementEvent);
  } catch (error) {
    console.error('Failed to track engagement:', error);
  }
};

export const clearUserData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ENGAGEMENT_KEY);
  localStorage.removeItem('travel_rewards_user_id');
};