import { Platform } from 'react-native';

export const API_CONFIG = {
  BASE_URL: Platform.OS === 'android' 
    ? 'http://10.0.2.2:5001/api' 
    : 'http://localhost:5001/api',
  TIMEOUT: 10000,
};


export const AUTH_KEYS = {
  TOKEN: 'user_token',
  USER: 'user_data',
};
