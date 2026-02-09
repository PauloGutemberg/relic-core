"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken } from "../../auth/session";
import { fetchMe, patchMe } from "../../profile/api/me.client";

export default function MePage() {
  const router = useRouter();
  const token = useMemo(() => getToken(), []);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  // form state (edição simples)
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      setLoading(true);
      const u = await fetchMe(token);
      if (!u) {
        clearToken();
        router.replace("/login");
        return;
      }
      setMe(u);
      setDisplayName(u.displayName ?? "");
      setBio(u.bio ?? "");
      setAvatarUrl(u.avatarUrl ?? "");
      setLoading(false);
    })();
  }, [token, router]);

  async function onSave() {
    if (!token) return;
    setPending(true);
    try {
      const updated = await patchMe(token, { displayName, bio, avatarUrl });
      if (!updated) {
        clearToken();
        router.replace("/login");
        return;
      }
      setMe(updated);
    } finally {
      setPending(false);
    }
  }

  function onLogout() {
    clearToken();
    router.replace("/login");
  }

  if (loading) return <main style={{ padding: 24 }}>Carregando perfil…</main>;

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
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} style={{ padding: 12, borderRadius: 12 }} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Bio</span>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ padding: 12, borderRadius: 12 }} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.75 }}>Avatar URL</span>
            <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} style={{ padding: 12, borderRadius: 12 }} />
          </label>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={onSave} disabled={pending} style={{ padding: "10px 12px", borderRadius: 12 }}>
              {pending ? "Salvando…" : "Salvar"}
            </button>
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              {pending ? "Atualizando perfil…" : "Alterações locais → API (mock)"}
            </span>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ fontSize: 16, opacity: 0.9 }}>Minhas Coleções</h2>
      </section>
    </main>
  );
}
