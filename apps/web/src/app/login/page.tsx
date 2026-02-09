"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../features/auth/api/auth.client";
import { setToken } from "../../features/auth/session";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("paulo");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const { token } = await login(username.trim());
      setToken(token);
      router.push("/me");
    } catch (err: any) {
      setError(err?.message ?? "Falha no login");
    } finally {
      setPending(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Entrar</h1>
      <p style={{ opacity: 0.75, marginTop: 6 }}>
        Auth mock (localStorage). Use: <b>paulo</b>
      </p>

      <form onSubmit={onSubmit} style={{ marginTop: 18, display: "grid", gap: 10 }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
        />
        <button
          disabled={pending}
          style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
        {error ? <p style={{ color: "tomato", margin: 0 }}>{error}</p> : null}
      </form>
    </main>
  );
}
