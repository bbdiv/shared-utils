import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export interface userAccount {
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

interface SessionStore {
  userAccount: userAccount | null;
  setUserAccount: (data: userAccount) => void;

  userData: UserData | null;
  setUserData: (data: UserData) => void;

  customerList: any[] | null;
  setCustomerList: (list: any[]) => void;

  customerId: string | null;
  setCustomerId: (id: string) => void;

  constructionId: string | null;
  setConstructionId: (id: string) => void;

  clearStore: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  userAccount: null,
  setUserAccount: (data: userAccount) => set({ userAccount: data }),

  userData: null,
  setUserData: (data: UserData) => set({ userData: data }),

  customerList: [],
  setCustomerList: (list: any[]) => set({ customerList: list }),

  customerId: "",
  setCustomerId: (id: string) => set({ customerId: id }),

  constructionId: "",
  setConstructionId: (id: string) => set({ constructionId: id }),

  clearStore: () =>
    set({
      userAccount: null,
      userData: null,
      customerId: "",
      constructionId: "",
    }),
}));

//hook for react components
export const useSession = () =>
  useSessionStore(
    useShallow((state) => ({
      userAccount: state.userAccount,
      setUserAccount: state.setUserAccount,
      userData: state.userData,
      setUserData: state.setUserData,
      customerList: state.customerList,
      setCustomerList: state.setCustomerList,
      customerId: state.customerId,
      setCustomerId: state.setCustomerId,
      constructionId: state.constructionId,
      setConstructionId: state.setConstructionId,
      clearStore: state.clearStore,
    }))
  );
