import "server-only";
import type { ItemDetailDTO } from "@/lib/item-detail";

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing API_BASE_URL (apps/web/.env.local)");
}

export async function fetchItemDetail(slug: string): Promise<ItemDetailDTO | null> {
  const res = await fetch(
    `${API_BASE_URL}/items/${encodeURIComponent(slug)}?expand=details`,
    { cache: "force-cache" } // mantém seu comportamento atual
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch item detail: ${res.status}`);

  return res.json();
}