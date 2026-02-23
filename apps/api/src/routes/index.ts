import { Router } from "express";
import { itemsRoutes } from "../items/items.routes";
import { authRoutes } from "../auth/auth.routes";

export const routes = Router();

routes.use(itemsRoutes);
routes.use(authRoutes);
