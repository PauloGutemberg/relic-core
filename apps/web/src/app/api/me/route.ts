// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/session.server";

export const runtime = "nodejs";

const API_BASE_URL = process.env.API_BASE_URL;

async function getAuthHeaders(): Promise<Record<string, string> | null> {
  if (!API_BASE_URL) return null;

  // Next mais novo pode tipar cookies() como async
  const store = await cookies();
  const sessionCookie = store.get(COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  const session = verifySession(sessionCookie);
  if (!session?.apiToken) return null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.apiToken}`,
  };
}

export async function GET() {
  if (!API_BASE_URL) {
    return NextResponse.json({ message: "Missing API_BASE_URL env var" }, { status: 500 });
  }

  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const upstream = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return NextResponse.json(
      { message: payload?.message ?? "Falha ao carregar perfil" },
      { status: upstream.status }
    );
  }

  return NextResponse.json(payload, { status: 200 });
}

export async function PATCH(req: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json({ message: "Missing API_BASE_URL env var" }, { status: 500 });
  }

  const headers = await getAuthHeaders();
  if (!headers) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const upstream = await fetch(`${API_BASE_URL}/me`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    return NextResponse.json(
      { message: payload?.message ?? "Falha ao atualizar perfil" },
      { status: upstream.status }
    );
  }

  return NextResponse.json(payload, { status: 200 });
}