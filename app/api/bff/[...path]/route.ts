import { NextRequest } from "next/server";
import { getBackendApiBaseUrl } from "@/lib/shared/api";

const REQUEST_HEADER_ALLOWLIST = [
  "accept",
  "authorization",
  "cookie",
  "content-type",
  "origin",
  "referer",
  "user-agent",
  "x-device-id",
  "x-requested-with",
];

const PUBLIC_API_ALLOWLIST = [
  /^api\/v1\/posts(?:\/.*)?$/,
  /^api\/v1\/recommendations(?:\/.*)?$/,
  /^api\/v1\/companies(?:\/.*)?$/,
  /^api\/v1\/companiesSummaries$/,
  /^api\/v1\/categories\/summary$/,
  /^api\/v1\/search(?:\/.*)?$/,
  /^api\/v1\/github(?:\/.*)?$/,
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

function isAllowedPublicPath(path: string[]): boolean {
  const joinedPath = path.join("/");
  return PUBLIC_API_ALLOWLIST.some((pattern) => pattern.test(joinedPath));
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
  const getSetCookie = (upstreamHeaders as Headers & { getSetCookie?: () => string[] }).getSetCookie;

  upstreamHeaders.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      return;
    }
    if (!RESPONSE_HEADER_BLOCKLIST.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  if (typeof getSetCookie === "function") {
    for (const cookie of getSetCookie.call(upstreamHeaders)) {
      headers.append("set-cookie", cookie);
    }
  }

  return headers;
}

async function proxyRequest(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  if (!isAllowedPublicPath(path)) {
    return new Response(
      JSON.stringify({ message: "Blocked by BFF policy" }),
      {
        status: 403,
        headers: new Headers({
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        }),
      },
    );
  }

  const targetUrl = buildBackendUrl(path, request.nextUrl.search);
  const method = request.method;
  const headers = copyRequestHeaders(request);

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(targetUrl, {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : new Uint8Array(await request.arrayBuffer()),
      cache: "no-store",
      redirect: "manual",
    });
  } catch (error) {
    console.error("[bff] upstream request failed", {
      targetUrl,
      method,
      error: error instanceof Error ? error.message : "Unknown upstream error",
    });

    return new Response(
      JSON.stringify({
        message: "Upstream request failed",
      }),
      {
        status: 502,
        headers: new Headers({
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
        }),
      },
    );
  }

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
