import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getDeviceId } from './deviceId';

const isServer = typeof window === 'undefined';
const PROD_API_URL = 'https://api.techinsights.shop';
const DEFAULT_LOCAL_API_URL = 'http://localhost:8080';
const BFF_BASE_PATH = '/api/bff';

const REFRESH_ENDPOINT = '/api/v1/auth/refresh';
const USERS_ME_ENDPOINT = '/api/v1/users/me';
const LOGOUT_ENDPOINT = '/api/v1/auth/logout';

function shouldRetryWithRefresh(url: string | undefined): boolean {
  if (!url) return false;
  if (url.includes(USERS_ME_ENDPOINT)) return false;
  if (url.includes(REFRESH_ENDPOINT)) return false;
  return true;
}

export function getBackendApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.VERCEL_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? PROD_API_URL
      : DEFAULT_LOCAL_API_URL)
  );
}

export function isProductionApiTarget(): boolean {
  return getBackendApiBaseUrl().startsWith(PROD_API_URL);
}

function applyDefaultHeaders(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  config.withCredentials = true;
  const headers = new AxiosHeaders();

  if (config.headers instanceof AxiosHeaders) {
    headers.set(config.headers);
  } else if (config.headers) {
    Object.entries(config.headers as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined) {
        headers.set(key, value as string | number | boolean | string[] | null);
      }
    });
  }

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
}

export const publicApi = axios.create({
  baseURL: isServer ? getBackendApiBaseUrl() : BFF_BASE_PATH,
  timeout: 10000,
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: getBackendApiBaseUrl(),
  timeout: 10000,
  withCredentials: true,
});

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

publicApi.interceptors.request.use((config) => applyDefaultHeaders(config));
authApi.interceptors.request.use((config) => applyDefaultHeaders(config));

publicApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error?.response?.status;

    if (status === 503) {
      if (typeof window !== 'undefined') {
        try {
          window.location.href = '/maintenance.html';
        } catch {
          // no-op
        }
      }
    }

    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
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
      const isRefreshRequest = config.url?.includes(REFRESH_ENDPOINT);
      if (isRefreshRequest) {
        onUnauthorized?.();
        return Promise.reject(error);
      }
      if (!shouldRetryWithRefresh(config.url)) {
        return Promise.reject(error);
      }
      config._retry = true;
      try {
        await authApi.post(REFRESH_ENDPOINT);
        return authApi.request(config);
      } catch {
        onUnauthorized?.();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export async function apiGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return publicApi.get<T>(url, config);
}

export async function apiPost<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return publicApi.post<T>(url, data, config);
}

export async function apiPut<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return publicApi.put<T>(url, data, config);
}

export async function apiDelete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return publicApi.delete<T>(url, config);
}

export async function authGet<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return authApi.get<T>(url, config);
}

export async function authPost<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return authApi.post<T>(url, data, config);
}

export async function authPut<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return authApi.put<T>(url, data, config);
}

export async function authDelete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return authApi.delete<T>(url, config);
}
