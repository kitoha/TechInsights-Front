import axios from 'axios';

const isProd = process.env.VERCEL_ENV === 'production';

export const api = axios.create({
  baseURL: isProd
    ? 'https://api.techinsights.shop'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

export const apiGet = <T = any>(url: string, config?: any) => api.get<T>(url, config);
export const apiPost = <T = any>(url: string, data?: any, config?: any) => api.post<T>(url, data, config);
