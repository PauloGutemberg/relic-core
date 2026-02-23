// src/lib/upstream.server.ts
import "server-only";

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) throw new Error("Missing API_BASE_URL (apps/web/.env.local)");

export type UpstreamOk<T> = { ok: true; data: T };
export type UpstreamErr = { ok: false; status: number; message: string; data?: any };
export type UpstreamResult<T> = UpstreamOk<T> | UpstreamErr;

export async function upstreamJson<T>(
  pathWithQuery: string,
  init?: RequestInit
): Promise<UpstreamResult<T>> {
  const url = `${API_BASE_URL}${pathWithQuery.startsWith("/") ? "" : "/"}${pathWithQuery}`;

  const res = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      ok: false as const,
      status: res.status,
      message: payload?.message ?? "Upstream request failed",
      data: payload ?? undefined,
    };
  }

  return { ok: true as const, data: payload as T };
}

export function isUpstreamErr<T>(r: UpstreamResult<T>): r is UpstreamErr {
  return r.ok === false;
}