import AsyncStorage from "@react-native-async-storage/async-storage";
import { CACHE_TTL_MS } from "@utils";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export const setCache = async <T>(key: string, data: T, ttl = CACHE_TTL_MS): Promise<void> => {
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttl };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  const entry = JSON.parse(raw) as CacheEntry<T>;
  if (Date.now() > entry.expiresAt) {
    await AsyncStorage.removeItem(key);
    return null;
  }
  return entry.data;
};

export const clearCache = async (key: string): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
