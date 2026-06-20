import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from './storage';
import { router } from 'expo-router';

// Default to localhost 8080 for Android emulator, or EXPO_PUBLIC_API_URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8080/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await secureStorage.getItemAsync('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error reading token from storage', error);
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: any) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = 'Bearer ' + token;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getItemAsync('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        
        if (res.data?.data?.accessToken) {
          const newAccessToken = res.data.data.accessToken;
          const newRefreshToken = res.data.data.refreshToken;
          
          await secureStorage.setItemAsync('accessToken', newAccessToken);
          if (newRefreshToken) {
            await secureStorage.setItemAsync('refreshToken', newRefreshToken);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          
          processQueue(null, newAccessToken);
          return api(originalRequest);
        } else {
          throw new Error('Invalid refresh token response');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        await secureStorage.deleteItemAsync('accessToken');
        await secureStorage.deleteItemAsync('refreshToken');
        
        // Redirect to login if token refresh fails
        router.replace('/(auth)/login');
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
