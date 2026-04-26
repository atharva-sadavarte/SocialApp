import { create } from 'zustand';
import { User } from '../models/User';
import apiService from '../services/apiService';
import { setStorageItem, getStorageItem, removeStorageItem } from '../utils/storage';
import { AUTH_KEYS } from '../constants/Config';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
  clearError: () => void;
}

export const useAuthViewModel = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setAuth: async (user, token) => {
    await setStorageItem(AUTH_KEYS.TOKEN, token);
    await setStorageItem(AUTH_KEYS.USER, JSON.stringify(user));
    set({ user, token, isAuthenticated: true, error: null });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;
      
      await setStorageItem(AUTH_KEYS.TOKEN, accessToken);
      await setStorageItem(AUTH_KEYS.USER, JSON.stringify(user));
      
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signup: async (username, email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.post('/auth/register', { 
        username, 
        email, 
        password, 
        confirmPassword 
      });
      set({ isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Signup failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      set({ isLoading: false });
      return response.data.otp; // Return OTP for testing as per backend implementation
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send OTP';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  verifyOTP: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.post('/auth/verify-otp', { email, otp });
      set({ isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid OTP';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  resetPassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.post('/auth/reset-password', data);
      set({ isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Reset failed';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    await removeStorageItem(AUTH_KEYS.TOKEN);
    await removeStorageItem(AUTH_KEYS.USER);
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = await getStorageItem(AUTH_KEYS.TOKEN);
      const userJson = await getStorageItem(AUTH_KEYS.USER);
      if (token && userJson) {
        set({ 
          token, 
          user: JSON.parse(userJson), 
          isAuthenticated: true 
        });
      }
    } catch (e) {
      console.error('Failed to restore session', e);
    }
  },

  clearError: () => set({ error: null }),
}));

export { useAuthViewModel };





