export type ApiResponse<T> = { data: T; meta?: { total?: number; page?: number } };

import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getDeviceId } from './deviceId';

const isProd = process.env.VERCEL_ENV === 'production';
const isServer = typeof window === 'undefined';

const REFRESH_ENDPOINT = '/api/v1/auth/refresh';
const USERS_ME_ENDPOINT = '/api/v1/users/me';

const AUTH_REQUIRED_PATTERNS = ['/api/v1/auth/'];
function isAuthRequiredUrl(url: string | undefined): boolean {
  if (!url) return false;
  return AUTH_REQUIRED_PATTERNS.some((p) => url.includes(p));
}

export function getApiBaseUrl(): string {
  return isProd
    ? 'https://api.techinsights.shop'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Connection': 'keep-alive',
  },
});

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

api.interceptors.request.use((config) => {
  config.withCredentials = true; 
  const headers = AxiosHeaders.from(config.headers || {});
  if (!isServer) {
    headers.set('X-Requested-With', 'XMLHttpRequest'); 
    const deviceId = getDeviceId();
    if (deviceId) {
      headers.set('X-Device-Id', deviceId);
    }
  }
  if (isServer) {
    const cloudflareSecret = process.env.CLOUDFLARE_SECRET_KEY;
    if (cloudflareSecret) {
      headers.set('x-auth-secret', cloudflareSecret);
      if (process.env.NODE_ENV === 'development') {
        const maskedSecret =
          cloudflareSecret.length > 8
            ? `${cloudflareSecret.slice(0, 4)}...${cloudflareSecret.slice(-4)}`
            : '[set]';
        console.info(`[api] x-auth-secret 헤더 적용: ${maskedSecret}`);
      }
    }
  }
  config.headers = headers;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error?.response?.status;
    const config = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (status === 503) {
      if (typeof window !== 'undefined') {
        try {
          window.location.href = '/maintenance.html';
        } catch {
          // no-op
        }
      }
      return Promise.reject(error);
    }

    if (status === 401 && typeof window !== 'undefined' && config && !config._retry) {
      if (config.url?.includes(USERS_ME_ENDPOINT)) {
        return Promise.reject(error);
      }
      const isRefreshRequest = config.url?.includes(REFRESH_ENDPOINT);
      if (isRefreshRequest) {
        onUnauthorized?.();
        return Promise.reject(error);
      }
      if (!isAuthRequiredUrl(config.url)) {
        return Promise.reject(error);
      }
      config._retry = true;
      try {
        await api.post(REFRESH_ENDPOINT);
        return api.request(config);
      } catch {
        onUnauthorized?.();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export async function apiGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return api.get<T>(url, config);
}

export async function apiPost<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return api.post<T>(url, data, config);
}

export async function apiPut<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return api.put<T>(url, data, config);
}

export async function apiDelete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return api.delete<T>(url, config);
}