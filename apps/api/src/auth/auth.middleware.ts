import type { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = String(req.headers.authorization ?? "");
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token || token !== "dev-token") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  (req as any).user = { id: "u1" };
  next();
}
