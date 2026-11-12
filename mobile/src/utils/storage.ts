import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Web fallback uses localStorage (Expo Web only — not production-secure)
const webStore = new Map<string, string>();

export const storage = {
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      webStore.set(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return webStore.get(key) ?? null;
    }
    return SecureStore.getItemAsync(key);
  },

  async remove(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      webStore.delete(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

