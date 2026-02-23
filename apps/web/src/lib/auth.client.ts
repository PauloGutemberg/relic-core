const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");

export async function login(username: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ username }),
  });

  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  return res.json() as Promise<{ token: string; user: any }>;
}
