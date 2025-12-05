import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { initSession } from "../utils/init";

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

  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string) => void;

  selectedCustomer: any | null;
  setSelectedCustomer: (customer: any) => void;

  selectedConstruction: any | null;
  setSelectedConstruction: (construction: any) => void;

  haveInitialized: boolean;
  setHaveInitialized: (value: boolean) => void;

  clearStore: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  userAccount: null,
  setUserAccount: (data: userAccount) => set({ userAccount: data }),

  userData: null,
  setUserData: (data: UserData) => set({ userData: data }),

  customerList: [],
  setCustomerList: (list: any[]) => set({ customerList: list }),

  selectedCustomerId: "",
  setSelectedCustomerId: (id: string) => set({ selectedCustomerId: id }),

  selectedCustomer: null,
  setSelectedCustomer: (customer: any) => set({ selectedCustomer: customer }),

  selectedConstruction: null,
  setSelectedConstruction: (construction: any) => set({ selectedConstruction: construction }),

  haveInitialized: false,
  setHaveInitialized: (value: boolean) => set({ haveInitialized: value }),

  clearStore: () =>
    set({
      userAccount: null,
      userData: null,
      selectedCustomerId: "",
      customerList: [],
      selectedConstruction: "",
      selectedCustomer: null,
     
    }),
}));

// let haveInit = false;

//hook for react components
export const useSession = (): Omit<SessionStore, "setSelectedCustomerId" | "setSelectedCustomer" | "setSelectedConstruction" | "setHaveInitialized"> => {
  if (!useSessionStore.getState().haveInitialized) {
    console.log("calling init");
    initSession();
  }

  return useSessionStore(
    useShallow((state: SessionStore) => ({
      userAccount: state.userAccount,
      setUserAccount: state.setUserAccount,
      userData: state.userData,
      setUserData: state.setUserData,
      customerList: state.customerList,
      setCustomerList: state.setCustomerList,
      selectedCustomerId: state.selectedCustomerId,
      // setSelectedCustomerId: state.setSelectedCustomerId,
      selectedCustomer: state.selectedCustomer,
      // setSelectedCustomer: state.setSelectedCustomer,
      selectedConstruction: state.selectedConstruction,
      // setSelectedConstruction: state.setSelectedConstruction,
      haveInitialized: state.haveInitialized,
      clearStore: state.clearStore,
    }))
  );
};
