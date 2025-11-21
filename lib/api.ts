export type ApiResponse<T> = { data: T; meta?: { total?: number; page?: number } };

import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';

const isProd = process.env.VERCEL_ENV === 'production';
const isServer = typeof window === 'undefined';

export const api = axios.create({
  baseURL: isProd
    ? 'https://api.techinsights.shop'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000, // 10초 타임아웃
  // HTTP Keep-Alive는 브라우저가 자동으로 처리하지만, 명시적으로 설정
  headers: {
    'Connection': 'keep-alive',
  },
});

api.interceptors.request.use((config) => {
  if (isServer) {
    const cloudflareSecret = process.env.CLOUDFLARE_SECRET_KEY;
    if (cloudflareSecret) {
      const headers = AxiosHeaders.from(config.headers || {});
      headers.set('x-auth-secret', cloudflareSecret);
      config.headers = headers;
      const maskedSecret =
        cloudflareSecret.length > 8
          ? `${cloudflareSecret.slice(0, 4)}...${cloudflareSecret.slice(-4)}`
          : cloudflareSecret;
      console.info(`[api] x-auth-secret 헤더 적용: ${maskedSecret}`);
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
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