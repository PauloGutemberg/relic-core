const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");

export async function fetchMe(token: string) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Failed to fetch me: ${res.status}`);
  return res.json();
}

export async function patchMe(
  token: string,
  patch: { displayName?: string; bio?: string; avatarUrl?: string }
) {
  const res = await fetch(`${API_BASE}/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(patch),
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Failed to patch me: ${res.status}`);
  return res.json();
}
