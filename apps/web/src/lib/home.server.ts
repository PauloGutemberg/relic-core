import "server-only";
import type { ItemListDTO } from "@/lib/item-list";

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing API_BASE_URL (apps/web/.env.local)");
}

export async function fetchItems(): Promise<ItemListDTO[]> {
  const res = await fetch(`${API_BASE_URL}/items`, {
    cache: "force-cache"
  });

  if (!res.ok) throw new Error(`Failed to fetch items: ${res.status}`);
  return res.json();
}