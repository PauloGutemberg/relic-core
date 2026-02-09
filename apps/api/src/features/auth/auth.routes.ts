import { Router } from "express";
import { loginController, meController, patchMeController } from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/auth/login", loginController);
authRoutes.get("/me", meController);
authRoutes.patch("/me", patchMeController);
