import { NextResponse } from "next/server";
import { COOKIE_NAME, sessionCookieOptions } from "@/lib/session.server";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  const base = { ...sessionCookieOptions(), maxAge: 0 };

  res.cookies.set(COOKIE_NAME, "", base);

  res.cookies.set(COOKIE_NAME, "", { ...base, domain: "localhost" });

  return res;
}