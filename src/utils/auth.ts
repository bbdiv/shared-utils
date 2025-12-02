import persistor from "../persistor";
import { useAuthStore, type AuthData } from "../store/auth";
import { setCookie } from "./cookies";
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

  persistor.setItem("authData", authData, 1 * 60 * 1000 * 10 * 6); //stale time 10 minutes
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
    console.log("response", response);
  } catch (error) {
    console.log("error refreshing token", error);
    if (window.location.pathname !== "/login") window.location.href = "/login";
  }
};

// export const clearAuth = () => {}

// export const logout = () => {}
