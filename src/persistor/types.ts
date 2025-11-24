export interface CacheItem<T> {
  value: T;
  timestamp: number;
}

export interface CacheResult<T> {
  value: T | null;
  isStale: boolean;
  timestamp: number | null;
}

export interface StorageAdapter<T> {
  read(key: string): Promise<CacheItem<T> | null>;
  write(key: string, item: CacheItem<T>): Promise<void>;
  remove(key: string): Promise<void>;
}
