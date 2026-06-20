import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';

// --- Secure Store (For sensitive tokens) ---
export const secureStorage = {
  setItemAsync: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (e) {
      console.error('secureStorage set error', e);
    }
  },
  getItemAsync: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.error('secureStorage get error', e);
      return null;
    }
  },
  deleteItemAsync: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (e) {
      console.error('secureStorage delete error', e);
    }
  },
};

export const clearTokens = async () => {
  await secureStorage.deleteItemAsync('accessToken');
  await secureStorage.deleteItemAsync('refreshToken');
};
