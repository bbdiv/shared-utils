import createPersistor from "../persistor";
import { useAuthStore } from "../store/auth";

import type { AuthData } from "../store/auth";
import { useSessionStore } from "../store/session";
import { getCustomerList } from "./session";

// save auth data from persistor to zustand store
const initAuth = async () => {
  const persistor = createPersistor<AuthData>("indexedDB");
  const authData = await persistor.get("authData");
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

  if (authData && isValidAuthData(authData)) {
    useAuthStore.getState().setAuth(authData);
  }
};

// save session data from persistor to zustand store
const initSession = async () => {
  const persistor = createPersistor("indexedDB");

  const userAccount = await persistor.get("userAccount");
  const userData = await persistor.get("userData");
  const customerId = await persistor.get("customerId");
  const constructionId = await persistor.get("constructionId");
  const customerList = await persistor.get("customerList");

  if (customerList) {
    useSessionStore.getState().setCustomerList(customerList);
  }

  console.log("[PUM] INIT session data from persistor:", {
    userAccount,
    userData,
    customerId,
    constructionId,
  });

  if (userAccount) {
    useSessionStore.getState().setUserAccount(userAccount);
  }
  if (userData) {
    useSessionStore.getState().setUserData(userData);
  }
  if (customerId) {
    useSessionStore.getState().setCustomerId(customerId);
  }
  if (constructionId) {
    useSessionStore.getState().setConstructionId(constructionId);
  }
  if (customerList) {
    useSessionStore.getState().setCustomerList(customerList);
  }
};

const init = async () => {
  console.log("[PUM] INIT INIT INIT INIT INIT INIT");

  await initAuth();
  await initSession();
};

export default init;
export { initAuth };
