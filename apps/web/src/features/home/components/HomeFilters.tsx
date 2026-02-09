"use client";

import { useMemo, useState } from "react";
import type { ItemListDTO } from "../types";
import { CollectionGrid } from "./CollectionGrid";
import styles from "../styles/HomePage.module.css";

type SortKey = "year-desc" | "year-asc" | "title-asc" | "title-desc";

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function HomeFilters({ items }: { items: ItemListDTO[] }) {
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<SortKey>("year-desc");

  const platforms = useMemo(
    () => Array.from(new Set(items.map((i) => i.platform))).sort((a, b) => a.localeCompare(b)),
    [items]
  );

  const tags = useMemo(
    () => Array.from(new Set(items.flatMap((i) => i.tags))).sort((a, b) => a.localeCompare(b)),
    [items]
  );

  const filtered = useMemo(() => {
    const q = normalize(query.trim());

    let out = items.filter((i) => {
      if (q) {
        const hay = normalize(`${i.title} ${i.shortDescription} ${i.platform} ${i.tags.join(" ")}`);
        if (!hay.includes(q)) return false;
      }
      if (platform && i.platform !== platform) return false;
      if (tag && !i.tags.includes(tag)) return false;
      return true;
    });

    out = [...out].sort((a, b) => {
      switch (sort) {
        case "year-desc":
          return b.year - a.year || a.title.localeCompare(b.title);
        case "year-asc":
          return a.year - b.year || a.title.localeCompare(b.title);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
      }
    });

    return out;
  }, [items, query, platform, tag, sort]);

  return (
    <>
      <div className={styles.toolbar} aria-label="Pesquisar e filtrar coleção">
        <div className={styles.toolbarRow}>
          <input
            className={styles.input}
            placeholder="Buscar por título…"
            aria-label="Buscar por título"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className={styles.select}
            aria-label="Filtrar por plataforma"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">Plataforma</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            aria-label="Filtrar por tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="">Tags</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            aria-label="Ordenar"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="year-desc">Ano (mais recente)</option>
            <option value="year-asc">Ano (mais antigo)</option>
            <option value="title-asc">Título (A–Z)</option>
            <option value="title-desc">Título (Z–A)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <CollectionGrid items={filtered} />
      </div>
    </>
  );
}
