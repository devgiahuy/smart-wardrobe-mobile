import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { secureStorage, TOKEN_KEYS } from './storage';
import { useAuthStore } from '../store/useAuthStore';

// Get API URL from env variables
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple concurrent refresh token requests
let isRefreshing = false;
// Queue of failed requests to be retried after token refresh
let failedQueue: { resolve: (value?: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await secureStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Handle 401 & Refresh Token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = 'Bearer ' + token;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = await secureStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // No refresh token available, logout user immediately
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        // Call refresh token endpoint (using plain axios to avoid infinite loop)
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken; // Optional if BE rotates refresh token

        // Save new tokens
        await secureStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, newAccessToken);
        if (newRefreshToken) {
          await secureStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        }

        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed (e.g. expired or invalid)
        processQueue(refreshError as AxiosError, null);
        
        // Clear auth state
        useAuthStore.getState().logout();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
