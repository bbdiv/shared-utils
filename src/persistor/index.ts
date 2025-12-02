import createIndexedDBAdapter from "./createIndexedDBAdapter";
import createLocalStorageAdapter from "./createLocalStorageAdapter";
import type { CacheItem, CacheResult, StorageAdapter } from "./types";

// Create persistor with common logic regardless of storage type
const createPersistor = <T = unknown>(
  storageType: "localStorage" | "indexedDB"
) => {
  // Select the appropriate storage adapter
  const storage: StorageAdapter<T> =
    storageType === "indexedDB"
      ? createIndexedDBAdapter<T>()
      : createLocalStorageAdapter<T>();

  // Common logic for determining if data is stale
  const isDataStale = (timestamp: number): boolean => {
    const isStale = Date.now() > timestamp;
    return isStale;
  };

  return {
    async get(key: string): Promise<T | null> {
      const item = await storage.read(key);
      if (!item || isDataStale(item.timestamp)) {
        return null;
      }
      console.log("[PUM] GET item from persistor:", key, item);

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

    async setItem(
      key: string,
      value: T,
      staleTime: number = 10 * 60 * 1000 // default stale time 10 minutes
    ): Promise<void> {
      const cacheItem: CacheItem<T> = {
        value,
        timestamp: Date.now() + staleTime,
      };
      await storage.write(key, cacheItem);
    },

    async removeItem(key: string): Promise<void> {
      await storage.remove(key);
    },
  };
};

const persistor = createPersistor("indexedDB");

export default persistor;
