"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Me = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
};

async function fetchMe(): Promise<Me | null> {
  const res = await fetch("/api/me", { cache: "no-store" });
  if (res.status === 401) return null;
  if (!res.ok) {
    const msg = (await res.json().catch(() => null))?.message ?? "Failed to fetch me";
    throw new Error(msg);
  }
  return res.json();
}

async function patchMe(
  payload: Partial<Pick<Me, "displayName" | "bio" | "avatarUrl">>
): Promise<Me | null> {
  const res = await fetch("/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) {
    const msg = (await res.json().catch(() => null))?.message ?? "Failed to patch me";
    throw new Error(msg);
  }
  return res.json();
}

export default function MePage({ initialMe = null }: { initialMe?: Me | null }) {
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(initialMe);
  const [loading, setLoading] = useState(!initialMe);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(initialMe?.displayName ?? "");
  const [bio, setBio] = useState(initialMe?.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialMe?.avatarUrl ?? "");

  // evita re-hidratar toda hora
  const returnTo = useMemo(() => encodeURIComponent("/profile"), []);

  useEffect(() => {
    // ✅ se veio SSR (initialMe), não precisa buscar
    if (initialMe) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const u = await fetchMe();
        if (!u) {
          router.replace(`/login?returnTo=${returnTo}`);
          return;
        }
        if (cancelled) return;

        setMe(u);
        setDisplayName(u.displayName ?? "");
        setBio(u.bio ?? "");
        setAvatarUrl(u.avatarUrl ?? "");
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Falha ao carregar perfil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialMe, router, returnTo]);

  async function onSave() {
    if (!me) return;

    setPending(true);
    setError(null);
    try {
      const updated = await patchMe({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      });

      if (!updated) {
        router.replace(`/login?returnTo=${returnTo}`);
        return;
      }

      setMe(updated);
      // SSR/Server components (se existir) revalidam
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Falha ao salvar");
    } finally {
      setPending(false);
    }
  }

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.replace("/login");
    router.refresh();
  }

  if (loading) return <main style={{ padding: 24 }}>Carregando perfil…</main>;
  if (!me) return null;

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>{me.displayName}</h1>
          <p style={{ marginTop: 6, opacity: 0.75 }}>@{me.username}</p>
        </div>
        <button onClick={onLogout} style={{ padding: "10px 12px", borderRadius: 12 }}>
          Sair
        </button>
      </div>

      <section style={{ marginTop: 18, border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, padding: 14 }}>
        <h2 style={{ marginTop: 0, fontSize: 16, opacity: 0.9 }}>Editar perfil</h2>

        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Nome</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={pending}
              style={{ padding: 12, borderRadius: 12 }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={pending}
              rows={3}
              style={{ padding: 12, borderRadius: 12 }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Avatar URL</span>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              disabled={pending}
              style={{ padding: 12, borderRadius: 12 }}
            />
          </label>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={onSave} disabled={pending} style={{ padding: "10px 12px", borderRadius: 12 }}>
              {pending ? "Salvando…" : "Salvar"}
            </button>
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              {pending ? "Atualizando perfil…" : "Alterações locais → API (mock)"}
            </span>
          </div>

          {error ? <p style={{ color: "tomato", margin: 0 }}>{error}</p> : null}
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 16, opacity: 0.9 }}>Minhas Coleções</h2>
      </section>
    </main>
  );
}