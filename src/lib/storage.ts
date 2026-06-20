import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const secureStorage = {
  setItemAsync: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn('LocalStorage error', e);
        return null;
      }
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  deleteItemAsync: async (key: string) => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};
