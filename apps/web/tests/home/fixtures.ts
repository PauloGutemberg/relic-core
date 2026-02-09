import type { ItemListDTO } from "../../src/features/home/types";

export const itemsFixture: ItemListDTO[] = [
  {
    slug: "smt-iv",
    title: "Shin Megami Tensei IV",
    shortDescription: "Escolhas entre lei, caos e neutralidade.",
    image: { src: "/images/smt-iv.jpeg", alt: "SMT IV" },
    year: 2013,
    platform: "Nintendo 3DS",
    tags: ["JRPG", "Turn-Based", "Demon Fusion"],
  },
  {
    slug: "smt-iv-apocalypse",
    title: "Shin Megami Tensei IV: Apocalypse",
    shortDescription: "Narrativa centrada em personagens num mundo pós-apocalíptico.",
    image: { src: "/images/smt-iva.jpeg", alt: "SMT IVA" },
    year: 2016,
    platform: "Nintendo 3DS",
    tags: ["JRPG", "Turn-Based", "Post-Apocalyptic"],
  },
  {
    slug: "ds-overclocked",
    title: "Devil Survivor Overclocked",
    shortDescription: "RPG tático em sete dias de caos.",
    image: { src: "/images/ds.jpeg", alt: "DSO" },
    year: 2011,
    platform: "Nintendo 3DS",
    tags: ["SRPG", "Tactics", "Multiple Endings"],
  },
];
