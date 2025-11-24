import axios, { type AxiosRequestConfig } from 'axios';
import apiEnvironments from './environments';

export const ssoInstance = (version: string = 'v1', configs?: AxiosRequestConfig) => axios.create({
	baseURL: `${apiEnvironments.sso.baseURL}/${version}`,
	timeout: configs?.timeout ?? 10000,
	headers: {
		'Content-Type': 'application/json',
		...configs?.headers ?? {},
	},
});

