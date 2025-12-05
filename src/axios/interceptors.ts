import axios from "axios";
import { logout, refreshToken } from "../utils/auth";
import { getCookie } from "../utils/cookies";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
const MAX_TRIES = 3;

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}


export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getCookie("idToken");
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
};


export const errorInterceptor = async (requestError: AxiosError) => {
  const failedReturn = () => Promise.reject(requestError);
  if (!requestError.response) return failedReturn();

  const config = requestError.config as RetryableAxiosRequestConfig | undefined;
  if (!config) return failedReturn();

  config.__retryCount = config.__retryCount || 1;
  if (config.__retryCount >= MAX_TRIES) return failedReturn();

  config.__retryCount += 1;

  const responseStatus = requestError.response?.status;

  if (responseStatus === 401) {
    const haveRefreshed = await refreshToken();
    if (haveRefreshed) {
      const { tokenType, idToken } = haveRefreshed;
      const type = tokenType || 'Bearer ';

      config.headers.set("Authorization", `${type} ${idToken}`);

      return axios(config);
    }

    logout();
    return failedReturn();
  }

  return failedReturn();
};