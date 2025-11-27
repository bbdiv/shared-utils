import createIndexedDBAdapter from "./createIndexedDBAdapter";
import createLocalStorageAdapter from "./createLocalStorageAdapter";
import type { CacheItem, CacheResult, StorageAdapter } from "./types";

// Create persistor with common logic regardless of storage type
const createPersistor = <T = unknown>(
  storageType: "localStorage" | "indexedDB",
  staleTime = 1 * 60 * 1000 * 1
) => {
  // stale 10min
  // Select the appropriate storage adapter
  const storage: StorageAdapter<T> =
    storageType === "indexedDB"
      ? createIndexedDBAdapter<T>()
      : createLocalStorageAdapter<T>();

  // Common logic for determining if data is stale
  const isDataStale = (timestamp: number): boolean => {
    const isStale = Date.now() - timestamp > staleTime;
    return isStale;
  };

  return {
    async get(key: string): Promise<T | null> {
      const item = await storage.read(key);
      if (!item) {
        return null;
      }
      // if (!item || isDataStale(item.timestamp)) {
      //   return null;
      // }
      return item.value;
    },

    async getWithMeta(key: string): Promise<CacheResult<T>> {
      const item = await storage.read(key);

      if (!item) {
        return { value: null, isStale: true, timestamp: null };
      }

      return {
        value: item.value,
        isStale: isDataStale(item.timestamp),
        timestamp: item.timestamp,
      };
    },

    async setItem(key: string, value: T): Promise<void> {
      const cacheItem: CacheItem<T> = {
        value,
        timestamp: Date.now(),
      };
      await storage.write(key, cacheItem);
    },

    async removeItem(key: string): Promise<void> {
      await storage.remove(key);
    },
  };
};

export default createPersistor;
