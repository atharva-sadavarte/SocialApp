import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, AUTH_KEYS } from '../constants/Config';

const apiService = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiService.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error getting token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiService;




