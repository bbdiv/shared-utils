import { get, set, del } from "idb-keyval";
import type { StorageAdapter, CacheItem } from "./types";

// IndexedDB adapter implementation
function createIndexedDBAdapter<T>(): StorageAdapter<T> {
  return {
    async read(key: string): Promise<CacheItem<T> | null> {
      return (await get<CacheItem<T>>(key)) || null;
    },

    async write(key: string, item: CacheItem<T>): Promise<void> {
      await set(key, item);
    },

    async remove(key: string): Promise<void> {
      await del(key);
    },
  };
}

export default createIndexedDBAdapter;
