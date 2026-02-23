import { items } from "./items.data";

export function listItems() {
  return items;
}

export function getItemBySlug(slug: string) {
  return items.find((i) => i.slug === slug) ?? null;
}
