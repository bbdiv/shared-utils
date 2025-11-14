import { create } from 'zustand';

// Auth store: manages authentication data
export interface AuthData {
  accessToken: string;
  expiresIn: number;
  idToken: string;
  refreshToken: string;
  tokenType?: string;
}

interface AuthStore {
  auth: AuthData | null;
  setAuth: (data: AuthData) => void;
  updateAuth: (data: Partial<AuthData>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  auth: null,
  setAuth: (data: AuthData) => set({ auth: data }),
  updateAuth: (data: Partial<AuthData>) =>
    set((state) => ({ auth: state.auth ? { ...state.auth, ...data } : null })),
  clearAuth: () => set({ auth: null }),
}));
