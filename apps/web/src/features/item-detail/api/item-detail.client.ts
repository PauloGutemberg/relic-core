import type { ItemDetailDTO } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");

export async function fetchItemDetail(slug: string): Promise<ItemDetailDTO | null> {
  const res = await fetch(
    `${API_BASE}/items/${encodeURIComponent(slug)}?expand=details`,
    { cache: "force-cache" }
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch item detail: ${res.status}`);

  return res.json();
}
