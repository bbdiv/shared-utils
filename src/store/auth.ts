import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { initAuth } from "../utils/init";

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
  haveInitialized: boolean;
  setHaveInitialized: (value: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  auth: null,
  setAuth: (data: AuthData) => set({ auth: data }),
  updateAuth: (data: Partial<AuthData>) =>
    set((state) => ({ auth: state.auth ? { ...state.auth, ...data } : null })),
  haveInitialized: false,
  setHaveInitialized: (value: boolean) => set({ haveInitialized: value }),
  clearAuth: () => set({ auth: null }),
}));

//hook for react components
export const useAuth = (): AuthStore => {
  if (!useAuthStore.getState().haveInitialized) {
    initAuth();
  }

 return useAuthStore(
    useShallow((state: AuthStore) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      updateAuth: state.updateAuth,
      clearAuth: state.clearAuth,
      haveInitialized: state.haveInitialized,
      setHaveInitialized: state.setHaveInitialized,
    }))
  );
}

//const { auth, setAuth } = useAuth();
