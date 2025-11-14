import { create } from 'zustand';
// User store: manages logged user data
export interface UserData {
  name: string;
  email: string;
  access: string[];
  permissions: string[];
  image?: string;
}

interface LoggedUserStore {
  user: UserData | null;
  setUser: (data: UserData) => void;
  updateUser: (data: Partial<UserData>) => void;
  clearUser: () => void;
}

export const useLoggedUserStore = create<LoggedUserStore>((set) => ({
  user: null,
  setUser: (data: UserData) => set({ user: data }),
  updateUser: (data: Partial<UserData>) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),
  clearUser: () => set({ user: null }),
}));
