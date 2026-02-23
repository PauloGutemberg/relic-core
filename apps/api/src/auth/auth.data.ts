export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
};

export const users: User[] = [
  {
    id: "u1",
    username: "paulo",
    displayName: "Paulo Gutemberg",
    bio: "Colecionador de RPGs portáteis. Shin Megami Tensei no 3DS é vida.",
    avatarUrl: "/avatars/paulo.png",
  },
];

export function makeToken(userId: string) {
  return `demo_${userId}`;
}

export function getUserByToken(token: string | null | undefined) {
  if (!token?.startsWith("demo_")) return null;
  const userId = token.slice("demo_".length);
  return users.find((u) => u.id === userId) ?? null;
}
