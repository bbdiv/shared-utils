import persistor from "../persistor";
import { useAuthStore, type AuthData } from "../store/auth";
import { useSessionStore } from "../store/session";
import { removeCookie, setCookie } from "./cookies";
import { ssoInstance } from "@axios";

/**
 * Salva os tokens de autenticação na store Auth e nos cookies do navegador.
 *
 * @param {AuthData} authData - Objeto contendo os tokens de autenticação (accessToken, refreshToken, idToken).
 */
export const saveAuth = (authData: AuthData) => {
  //salva os tokens na store Auth
  useAuthStore.getState().setAuth(authData);

  //salva os tokens nos cookies
  const domain = window.location.hostname.replace(/^plataforma\./, ".");

  setCookie("accessToken", authData.accessToken, 1, domain);
  setCookie("refreshToken", authData.refreshToken, 30, domain);
  setCookie("idToken", authData.idToken, 1, domain);

  // persistor.setItem("authData", authData, 1 * 1000 * 60 * 60 ); //stale time 1 hour
  persistor.setItem("authData", authData, 1 * 1000 * 60 * 10 ); //stale time 10min
};

export const login = async (credentials: {
  username: string;
  password: string;
  redirect: string;
}) => {
  try {
    const response = await ssoInstance().post("/auth", credentials);
    console.log("response", response);
    if (response.status === 200) {
      saveAuth(response.data.data);
      return response.data.data;
    } else {
      const error = new Error("Login failed");
      (error as any).response = response;
      throw error;
    }
  } catch (err: any) {
    // If axios throws, attach its response if available
    if (err.response) {
      const error = new Error("Login failed");
      (error as any).response = err.response;
      throw error;
    }
    throw err;
  }
};

export const refreshToken = async () => {
  try {
    const response = await ssoInstance("v1", { withCredentials: true }).post(
      "/retrieve-new-token"
    );
    saveAuth(response.data.data);
    console.log("response", response);
  } catch (error) {
    console.log("error refreshing token", error);
    if (window.location.pathname !== "/login") window.location.href = "/login";
    // Throw the error so callers can handle it appropriately
    throw error;
  }
};

// export const clearAuth = () => {}

export const logout = () => {
 
  removeCookie("accessToken");
  removeCookie("refreshToken");
  removeCookie("idToken");
 
  persistor.removeItem("authData");
  persistor.removeItem("customerList");
  persistor.removeItem("selectedCustomer");
  persistor.removeItem("selectedCustomerId");
  persistor.removeItem("userAccount");
  persistor.removeItem("userData");
 
 
  useAuthStore.getState().clearAuth();
  useSessionStore.getState().clearStore();
 
  window.location.href = "/login";
}
 
