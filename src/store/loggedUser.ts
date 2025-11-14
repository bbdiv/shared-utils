import { create } from 'zustand';



export interface userAccount{
  consent: Record<string, string>[];
  email: string;
  first_access: boolean;
  is_imported: boolean;
  take_to_suite: boolean;
  }
  
export interface UserData {
  created_at: string;
  deleted_at: string | null;
  email: string;
  groups: any[];
  id: string;
  name: string;
  updated_at: string;
}



interface LoggedUserStore {
  userAccount: userAccount | null;
  setUserAccount: (data: userAccount) => void;

  userData: UserData | null;
  setUserData: (data: UserData) => void;

  customerList: any[];
  setCustomerList: (data: any[]) => void;

  clearStore: () => void;
}

// User store: manages logged user data
export const useLoggedUserStore = create<LoggedUserStore>((set) => ({
  userAccount: null,
  setUserAccount: (data: userAccount) => set({ userAccount: data }),

  userData: null,
  setUserData: (data: UserData) => set({ userData: data }),

  customerList : [],
  setCustomerList: (data: any[]) => set({ customerList: data }),
 
  clearStore: () => set({ userAccount: null, userData: null, customerList: []}),
}));
