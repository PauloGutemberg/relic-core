import { NextResponse } from "next/server";
import { COOKIE_NAME, signSession, sessionCookieOptions } from "@/lib/session.server";

export const runtime = "nodejs";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(req: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json({ message: "Missing API_BASE_URL env var" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const upstream = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await upstream.json().catch(() => null)) as any;

  if (!upstream.ok) {
    return NextResponse.json(
      { message: data?.message ?? "Falha no login" },
      { status: upstream.status }
    );
  }

  const apiToken: string | undefined = data?.token;
  const sub: string | undefined = data?.user?.id;

  if (!apiToken || !sub) {
    return NextResponse.json(
      { message: "Upstream payload inválido" },
      { status: 502 }
    );
  }

  const sessionToken = signSession(String(sub), String(apiToken));

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set(COOKIE_NAME, sessionToken, sessionCookieOptions());
  return res;
}