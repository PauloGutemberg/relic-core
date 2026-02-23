import type { Request, Response } from "express";
import { getItemBySlug, listItems } from "./items.service";

export function listItemsController(_req: Request, res: Response) {
  const items = listItems().map((i) => ({
    slug: i.slug,
    title: i.title,
    shortDescription: i.shortDescription,
    image: i.image,
    year: i.year,
    platform: i.platform,
    tags: i.tags,
  }));

  res.json(items);
}

export function getItemBySlugController(req: Request, res: Response) {
  const slug = String(req.params.slug ?? "");
  const item = getItemBySlug(slug);

  if (!item) return res.status(404).json({ message: "Item not found" });

  const expand = String(req.query.expand ?? "");

  if (expand === "details") {
    return res.json(item);
  }

  return res.json({
    slug: item.slug,
    title: item.title,
    shortDescription: item.shortDescription,
    image: item.image,
  });
}

