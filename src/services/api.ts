import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, type AxiosRequestConfig } from 'axios';

import { config } from '@/constants/config';

export const BASE_URL = config.apiUrl;
export const AUTH_TOKEN_KEY = 'shoplite-auth-token';

export const apiClient = create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (request) => {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }

    return Promise.reject(error);
  },
);

export async function setAuthToken(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest<T>(
  endpoint: string,
  requestConfig?: AxiosRequestConfig,
): Promise<T> {
  const response = await apiClient.request<T>({
    url: endpoint,
    ...requestConfig,
  });

  return response.data;
}
