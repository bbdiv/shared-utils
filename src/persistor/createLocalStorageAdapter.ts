import type { StorageAdapter, CacheItem } from './types';

// LocalStorage adapter implementation
function createLocalStorageAdapter<T>(): StorageAdapter<T> {
  return {
    async read(key: string): Promise<CacheItem<T> | null> {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    },

    async write(key: string, item: CacheItem<T>): Promise<void> {
      localStorage.setItem(key, JSON.stringify(item));
    },

    async remove(key: string): Promise<void> {
      localStorage.removeItem(key);
    },
  };
}

export default createLocalStorageAdapter;
