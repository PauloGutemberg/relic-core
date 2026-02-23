import MePage from "@/components/profile/me.page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySession } from "@/lib/session.server";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.API_BASE_URL;

async function fetchMeServer() {
  if (!API_BASE_URL) throw new Error("Missing API_BASE_URL (apps/web/.env.local)");

  const store = await cookies();
  const cookie = store.get(COOKIE_NAME)?.value;
  if (!cookie) return null;

  const session = verifySession(cookie);
  if (!session?.apiToken) return null;

  const r = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.apiToken}`,
    },
    cache: "no-store",
  });

  if (r.status === 401) return null;
  if (!r.ok) return null;

  return r.json().catch(() => null);
}

export default async function ProfilePage() {
  const me = await fetchMeServer();

  if (!me) redirect("/login?returnTo=/profile");

  return <MePage initialMe={me} />;
}