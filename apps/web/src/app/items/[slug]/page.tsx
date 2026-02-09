import { notFound } from "next/navigation";
import { fetchItems } from "../../../features/home/api/home.client";
import { fetchItemDetail } from "../../../features/item-detail/api/item-detail.client";
import { ItemDetailPage } from "../../../features/item-detail/components/ItemDetailPage";

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
