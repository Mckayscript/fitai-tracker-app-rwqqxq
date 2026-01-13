
// Initialize Natively console log capture before anything else
import './utils/errorLogger';

// Log app startup
console.log('FitAI Tracker app starting...');

try {
  // Import expo-router entry point
  require('expo-router/entry');
  console.log('Expo Router initialized successfully');
} catch (error) {
  console.error('Failed to initialize Expo Router:', error);
  throw error;
}
