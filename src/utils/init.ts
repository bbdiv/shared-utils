import persistor from "../persistor";
import { useAuthStore } from "../store/auth";

import type { AuthData } from "../store/auth";
import { useSessionStore } from "../store/session";
import { refreshToken } from "./auth";
import { getAccountData, getCustomerList, getUserData } from "./session";

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
  const {value: userAccount, isStale: userAccountIsStale} = await persistor.getWithMeta("userAccount");
  const {value: userData, isStale: userDataIsStale} = await persistor.getWithMeta("userData");

  const {value: selectedConstruction} = await persistor.getWithMeta("selectedConstruction");
  const {value: selectedCustomer} = await persistor.getWithMeta("selectedCustomer");




  if(userAccountIsStale) {
    getAccountData(useAuthStore.getState().auth?.idToken, userAccount.email).then(data=>{
      useSessionStore.getState().setUserAccount(data);
      persistor.setItem("userAccount", data, 10 * 60 * 1000 * 6); // 1 hour
    });

  }else{
    useSessionStore.getState().setUserAccount(userAccount);
  }



  if(userDataIsStale) {
    getUserData(userData.email).then(data=>{
      useSessionStore.getState().setUserData(data);
      persistor.setItem("userData", data, 10 * 60 * 1000 * 6); // 1 hour
    });
  }else{
    useSessionStore.getState().setUserData(userData);
  }




  if (selectedConstruction) {
    useSessionStore.getState().setSelectedConstruction(selectedConstruction);
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