import type { ItemListDTO } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL (apps/web/.env.local)");
}

export async function fetchItems(): Promise<ItemListDTO[]> {
  const res = await fetch(`${API_BASE}/items`, { cache: "force-cache" }); // SSG/Home
  if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`);
  return res.json();
}
