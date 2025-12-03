import persistor from "../persistor";
import { useAuthStore } from "../store/auth";

import type { AuthData } from "../store/auth";
import { useSessionStore } from "../store/session";
import { refreshToken } from "./auth";
import { getCustomerList } from "./session";

// save auth data from persistor to zustand store
const initAuth = async () => {
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

  if (isStale) {
    console.log("[PUM] Auth data is stale");
    await refreshToken();
    return;
  }

  if (authData && isValidAuthData(authData)) {
    useAuthStore.getState().setAuth(authData);
  }
};

// save session data from persistor to zustand store
const initSession = async () => {
  const userAccount = await persistor.get("userAccount");
  const userData = await persistor.get("userData");
  const selectedCustomerId = await persistor.get("selectedCustomerId");
  const constructionId = await persistor.get("constructionId");
  const customerList = await persistor.get("customerList");
  const selectedCustomer = await persistor.get("selectedCustomer");

  console.log("[PUM] INIT session data from persistor:", {
    userAccount,
    userData,
    selectedCustomerId,
    constructionId,
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
    constructionId,
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
  if (constructionId) {
    useSessionStore.getState().setConstructionId(constructionId);
  }
  if (customerList) {
    useSessionStore.getState().setCustomerList(customerList);
  }
  if (selectedCustomer) {
    useSessionStore.getState().setSelectedCustomer(selectedCustomer);
  }
};

const init = async () => {
  console.log("[PUM] INIT INIT INIT INIT INIT INIT");

  await initAuth();
  await initSession();
};

export default init;
export { initAuth };
