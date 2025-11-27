import createPersistor from "../persistor";
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
  const domain = window.location.hostname;

  setCookie("accessToken", authData.accessToken, 1, domain);
  setCookie("refreshToken", authData.refreshToken, 30, domain);
  setCookie("idToken", authData.idToken, 1, domain);

  const persistor = createPersistor<AuthData>("indexedDB", 30 * 60 * 1000); //stale time 30 minutes
  persistor.setItem("authData", authData);
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

// export const refreshToken = () => {}

// export const clearAuth = () => {}

// export const logout = () => {}
