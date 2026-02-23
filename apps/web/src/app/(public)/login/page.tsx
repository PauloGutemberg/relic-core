"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function safeReturnTo(raw: string | null, fallback = "/profile") {
  if (!raw) return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  if (raw.startsWith("/api")) return fallback;
  return raw;
}

export default function LoginPage() {
  const search = useSearchParams();

  const returnTo = useMemo(() => safeReturnTo(search.get("returnTo"), "/profile"), [search]);

  const [username, setUsername] = useState("paulo");
  const [password, setPassword] = useState("1234");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const canSubmit = username.trim().length > 0 && password.length > 0 && !pending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (!res.ok) {
        const msg = (await res.json().catch(() => null))?.message ?? "Falha no login";
        throw new Error(msg);
      }

      // ✅ navegação "hard" pra evitar cache/prefetch do App Router
      window.location.assign(returnTo);
      return;
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
        Login (cookie HttpOnly). Use: <b>paulo</b> + <b>1234</b>
      </p>

      <form onSubmit={onSubmit} style={{ marginTop: 18, display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={pending}
            style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, opacity: 0.8 }}>Senha</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              disabled={pending}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={pending}
              style={{ padding: "12px 10px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={!canSubmit}
          style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)" }}
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>

        {error ? (
          <p role="alert" style={{ color: "tomato", margin: 0 }}>
            {error}
          </p>
        ) : null}

        {returnTo !== "/profile" ? (
          <p style={{ margin: 0, opacity: 0.65, fontSize: 13 }}>
            Você será redirecionado para: <code>{returnTo}</code>
          </p>
        ) : null}
      </form>
    </main>
  );
}