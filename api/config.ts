import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.6:3000/api';

export const API_CONFIG = {
  BASE_URL: apiUrl,
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};
