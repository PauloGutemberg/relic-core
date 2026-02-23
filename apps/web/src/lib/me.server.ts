import "server-only";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/session.server";

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) throw new Error("Missing API_BASE_URL (apps/web/.env.local)");

export async function fetchMeServer(): Promise<any | null> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME)?.value;
  if (!cookie) return null;

  const session = verifySession(cookie);
  if (!session?.apiToken) return null;

  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.apiToken}`,
    },
    cache: "no-store",
  });

  if (res.status === 401) return null;
  if (!res.ok) {
    const msg = (await res.json().catch(() => null))?.message ?? `Failed to fetch me: ${res.status}`;
    throw new Error(msg);
  }

  return res.json();
}