import "server-only";

import { getBackendApiBaseUrl } from "./api";

type QueryValue = string | number | boolean | null | undefined;

interface FetchBackendJsonOptions {
  params?: Record<string, QueryValue>;
  cache?: RequestCache;
  revalidate?: number;
  headers?: Record<string, string>;
}

export class BackendFetchError extends Error {
  status: number;

  constructor(status: number, message?: string) {
    super(message ?? `Backend request failed with status ${status}`);
    this.name = "BackendFetchError";
    this.status = status;
  }
}

export function isBackendFetchError(error: unknown): error is BackendFetchError {
  return error instanceof BackendFetchError;
}

export async function fetchBackendJson<T>(
  path: string,
  { params, cache, revalidate, headers: customHeaders }: FetchBackendJsonOptions = {},
): Promise<T> {
  const url = new URL(path, getBackendApiBaseUrl());

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers = new Headers({
    accept: "application/json",
    ...customHeaders,
  });

  const cloudflareSecret = process.env.CLOUDFLARE_SECRET_KEY;
  if (cloudflareSecret) {
    headers.set("x-auth-secret", cloudflareSecret);
  }

  const response = await fetch(url.toString(), {
    headers,
    cache: cache ?? "force-cache",
    ...(cache === "no-store" ? {} : { next: { revalidate: revalidate ?? 60 } }),
  });

  if (!response.ok) {
    throw new BackendFetchError(response.status);
  }

  return response.json() as Promise<T>;
}
