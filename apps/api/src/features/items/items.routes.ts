import { Router } from "express";
import { getItemBySlugController, listItemsController } from "./items.controller";

export const itemsRoutes = Router();

itemsRoutes.get("/items", listItemsController);
itemsRoutes.get("/items/:slug", getItemBySlugController);
