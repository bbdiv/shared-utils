import { getCookie } from '../utils/cookies';
import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getCookie('idToken');
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
};
