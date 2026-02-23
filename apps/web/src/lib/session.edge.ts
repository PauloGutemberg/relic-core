import { COOKIE_NAME, MAX_AGE_SECONDS } from "@/lib/session.shared";

function base64UrlToUint8Array(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export type EdgeSession = { sub: string };

export async function verifySessionEdge(token: string): Promise<EdgeSession | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  // parse payload
  let sub: string | null = null;
  let exp: number | null = null;
  try {
    const jsonStr = new TextDecoder().decode(base64UrlToUint8Array(payload));
    const json = JSON.parse(jsonStr);
    sub = typeof json?.sub === "string" ? json.sub : null;
    exp = Number(json?.exp);
    if (!sub || !Number.isFinite(exp)) return null;
  } catch {
    return null;
  }

  // exp check
  const now = Math.floor(Date.now() / 1000);
  if (exp! < now) return null;
  if (exp! > now + MAX_AGE_SECONDS + 60) {
    // sanity (evita tokens bizarros muito no futuro)
    return null;
  }

  // HMAC verify
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = uint8ArrayToBase64Url(new Uint8Array(mac));

  if (!constantTimeEqual(sig, expected)) return null;

  return { sub: sub! };
}

export { COOKIE_NAME };