import { Router } from "express";
import { itemsRoutes } from "../features/items/items.routes";
import { authRoutes } from "../features/auth/auth.routes";

export const routes = Router();

routes.use(itemsRoutes);
routes.use(authRoutes);
