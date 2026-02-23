import { notFound } from "next/navigation";
import { fetchItems } from "@/lib/home.server";
import { fetchItemDetail } from "@/lib/item-detail.server";
import { ItemDetailPage } from "@/components/item-detail/ItemDetailPage";

export const revalidate = 86400;

export async function generateStaticParams() {
  const items = await fetchItems();
  return items.map((i) => ({ slug: i.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = await fetchItemDetail(slug);
  if (!item) return notFound();

  return <ItemDetailPage item={item} />;
}
