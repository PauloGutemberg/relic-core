import type { Request, Response } from "express";
import { getUserByToken, makeToken, users } from "./auth.data";

function readBearerToken(req: Request) {
  const raw = req.header("authorization") ?? "";
  const m = raw.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export function loginController(req: Request, res: Response) {
  const username = String(req.body?.username ?? "").trim().toLowerCase();
  if (!username) return res.status(400).json({ message: "username is required" });

  const user = users.find((u) => u.username.toLowerCase() === username);
  if (!user) return res.status(401).json({ message: "invalid credentials" });

  const token = makeToken(user.id);
  res.json({ token, user });
}

export function meController(req: Request, res: Response) {
  const token = readBearerToken(req);
  const user = getUserByToken(token);
  if (!user) return res.status(401).json({ message: "unauthorized" });

  res.json(user);
}

export function patchMeController(req: Request, res: Response) {
  const token = readBearerToken(req);
  const user = getUserByToken(token);
  if (!user) return res.status(401).json({ message: "unauthorized" });

  const displayName = req.body?.displayName;
  const bio = req.body?.bio;
  const avatarUrl = req.body?.avatarUrl;

  if (typeof displayName === "string") user.displayName = displayName.slice(0, 40);
  if (typeof bio === "string") user.bio = bio.slice(0, 160);
  if (typeof avatarUrl === "string") user.avatarUrl = avatarUrl.slice(0, 300);

  res.json(user);
}
