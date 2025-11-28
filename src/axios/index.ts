import axios, { type AxiosRequestConfig } from "axios";
import { requestInterceptor } from "./interceptors";
import apiEnvironments from "./environments";

export const ssoInstance = (
  version: string = "v1",
  configs?: AxiosRequestConfig
) =>
  axios.create({
    baseURL: `${apiEnvironments.sso.baseURL}/${version}`,
    timeout: configs?.timeout ?? 10000,
    withCredentials: configs?.withCredentials ?? false,
    headers: {
      "Content-Type": "application/json",
      ...(configs?.headers ?? {}),
    },
  });

//TODO : verify if suite v3 will be default
export const suiteInstance = (
  customerId: string,
  version: string = "v3",
  configs?: AxiosRequestConfig
) => {
  const instance = axios.create({
    baseURL: `${apiEnvironments.suite.baseURL}/${version}`,
    timeout: configs?.timeout ?? 10000,
    headers: {
      "Content-Type": "application/json",
      "X-Customer-Id": customerId,
      ...(configs?.headers ?? {}),
    },
  });
  instance.interceptors.request.use(requestInterceptor);
  return instance;
};
