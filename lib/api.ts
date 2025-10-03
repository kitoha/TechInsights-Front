export type ApiResponse<T> = { data: T; meta?: { total?: number; page?: number } };

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const isProd = process.env.VERCEL_ENV === 'production';

export const api = axios.create({
  baseURL: isProd
    ? 'https://api.techinsights.shop'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
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
