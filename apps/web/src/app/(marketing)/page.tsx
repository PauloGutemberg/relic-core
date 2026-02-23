import Link from "next/link";

export default function MarketingHome() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Relic</h1>
      <p>Sua coleção, organizada e valorizada.</p>

      <div style={{ marginTop: 16 }}>
        <Link href="/home">Entrar no app</Link>
      </div>
    </div>
  );
}
