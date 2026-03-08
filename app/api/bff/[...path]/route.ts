import { NextRequest } from "next/server";
import { getBackendApiBaseUrl } from "@/lib/shared/api";

const REQUEST_HEADER_ALLOWLIST = [
  "accept",
  "content-type",
  "x-device-id",
  "x-requested-with",
];

const RESPONSE_HEADER_BLOCKLIST = new Set([
  "connection",
  "content-length",
  "content-encoding",
  "keep-alive",
  "transfer-encoding",
]);

function buildBackendUrl(path: string[], search: string): string {
  const joinedPath = path.join("/");
  return `${getBackendApiBaseUrl()}/${joinedPath}${search}`;
}

function copyRequestHeaders(request: NextRequest): Headers {
  const headers = new Headers();

  for (const headerName of REQUEST_HEADER_ALLOWLIST) {
    const value = request.headers.get(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }

  const cloudflareSecret = process.env.CLOUDFLARE_SECRET_KEY;
  if (cloudflareSecret) {
    headers.set("x-auth-secret", cloudflareSecret);
  }

  return headers;
}

function copyResponseHeaders(upstreamHeaders: Headers): Headers {
  const headers = new Headers();

  upstreamHeaders.forEach((value, key) => {
    if (!RESPONSE_HEADER_BLOCKLIST.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return headers;
}

async function proxyRequest(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const targetUrl = buildBackendUrl(path, request.nextUrl.search);
  const method = request.method;
  const headers = copyRequestHeaders(request);

  const upstreamResponse = await fetch(targetUrl, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : await request.text(),
    cache: "no-store",
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: copyResponseHeaders(upstreamResponse.headers),
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}
