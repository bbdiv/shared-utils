import persistor from "../persistor";
import { useAuthStore } from "../store/auth";

import type { AuthData } from "../store/auth";
import { useSessionStore } from "../store/session";
import { refreshToken } from "./auth";
import { getCustomerList } from "./session";

// save auth data from persistor to zustand store
export const initAuth = async () => {
  const { value: authData, isStale } = await persistor.getWithMeta("authData");
  console.log("[PUM] INIT authData from persistor:", authData);

  function isValidAuthData(data: any): data is AuthData {
    return (
      typeof data === "object" &&
      typeof data.accessToken === "string" &&
      typeof data.expiresIn === "number" &&
      typeof data.idToken === "string" &&
      typeof data.refreshToken === "string"
    );
  }

  // if (isStale) {
  //   console.log("[PUM] Auth data is stale");
  //   await refreshToken();
  //   return;
  // }

  if (authData && isValidAuthData(authData)) {
    useAuthStore.getState().setAuth(authData);
  }
  
  useAuthStore.getState().setHaveInitialized(true);
};

// save session data from persistor to zustand store
export const initSession = async () => {
  const {value: userAccount} = await persistor.getWithMeta("userAccount");
  const {value: userData} = await persistor.getWithMeta("userData");
  const {value: selectedCustomerId} = await persistor.getWithMeta("selectedCustomerId");
  const {value: selectedConstruction} = await persistor.getWithMeta("selectedConstruction");
  const {value: customerList} = await persistor.getWithMeta("customerList");
  const {value: selectedCustomer} = await persistor.getWithMeta("selectedCustomer");

  console.log("[PUM] INIT session data from persistor:", {
    userAccount,
    userData,
    selectedCustomerId,
    selectedConstruction,
    customerList,
    selectedCustomer,
  });

  if (customerList) {
    useSessionStore.getState().setCustomerList(customerList);
  }

  console.log("[PUM] INIT session data from persistor:", {
    userAccount,
    userData,
    selectedCustomerId,
    selectedConstruction,
    selectedCustomer,
  });

  if (userAccount) {
    useSessionStore.getState().setUserAccount(userAccount);
  }
  if (userData) {
    useSessionStore.getState().setUserData(userData);
  }
  if (selectedCustomerId) {
    useSessionStore.getState().setSelectedCustomerId(selectedCustomerId);
  }
  if (selectedConstruction) {
    useSessionStore.getState().setSelectedConstruction(selectedConstruction);
  }
  if (customerList) {
    useSessionStore.getState().setCustomerList(customerList);
  }
  if (selectedCustomer) {
    useSessionStore.getState().setSelectedCustomer(selectedCustomer);
  }

    useSessionStore.getState().setHaveInitialized(true);
};

const init = async () => {
  console.log("[PUM] INIT INIT INIT INIT INIT INIT");

  await initAuth();
  await initSession();
};

export default init;