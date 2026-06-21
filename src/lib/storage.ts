import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { StateStorage } from 'zustand/middleware';

// -----------------------------------------------------------------------------
// 1. Async Storage (Compatible with Expo Go)
// Used for: Non-sensitive app state (Theme, User Profile caching, etc.)
// -----------------------------------------------------------------------------
export const zustandStorage: StateStorage = {
  setItem: async (name, value) => {
    return await AsyncStorage.setItem(name, value);
  },
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  removeItem: async (name) => {
    return await AsyncStorage.removeItem(name);
  },
};

// -----------------------------------------------------------------------------
// 2. Secure Storage (Encrypted, Asynchronous)
// Used for: Sensitive data like Access Token, Refresh Token
// -----------------------------------------------------------------------------
export const secureStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`SecureStore Error saving ${key}:`, error);
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`SecureStore Error getting ${key}:`, error);
      return null;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`SecureStore Error removing ${key}:`, error);
    }
  },
};

// Helper keys for tokens
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
};
