// src/lib/session.server.ts
import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE_NAME = "session";
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("Missing AUTH_SECRET env var");
  return s;
}

/**
 * Assina uma sessão com:
 * - sub: identificador do usuário (ex.: user.id)
 * - exp: expiração (epoch seconds)
 * - apiToken (opcional): token retornado pela API (ex.: JWT / demo token)
 */
export function signSession(sub: string, apiToken?: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;

  const obj: { sub: string; exp: number; apiToken?: string } = { sub, exp };
  if (apiToken) obj.apiToken = apiToken;

  const payload = Buffer.from(JSON.stringify(obj)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/**
 * Verifica assinatura + expiração.
 * Retorna { sub, apiToken? } ou null.
 */
export function verifySession(token: string): { sub: string; apiToken?: string } | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");

  // evita throws e leaks desnecessários
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;

  try {
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as any;

    if (!json?.sub || !json?.exp) return null;

    const exp = Number(json.exp);
    if (!Number.isFinite(exp)) return null;
    if (exp < Math.floor(Date.now() / 1000)) return null;

    const sub = String(json.sub);
    const apiToken = typeof json.apiToken === "string" ? json.apiToken : undefined;

    return { sub, apiToken };
  } catch {
    return null;
  }
}

/**
 * Opções padronizadas do cookie de sessão (usar em res.cookies.set()).
 */
export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}