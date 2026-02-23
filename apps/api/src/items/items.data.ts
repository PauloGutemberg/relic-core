export type ItemListDTO = {
  slug: string;
  title: string;
  shortDescription: string;
  image: {
    src: string;
    alt: string;
  };
};

export type ItemDetailDTO = ItemListDTO & {
  fullDescription: string;
  year: number;
  platform: string;
  tags: string[];
};

export const items: ItemDetailDTO[] = [
  {
    slug: "shin-megami-tensei-strange-journey-redux",
    title: "Shin Megami Tensei: Strange Journey Redux",
    shortDescription:
      "Expedição no Schwarzwelt, escolhas morais e demônios recrutáveis em um RPG intenso.",
    fullDescription:
      "Um RPG intenso em primeira pessoa ambientado em um futuro próximo, onde uma força misteriosa conhecida como Schwarzwelt ameaça a humanidade. Com escolhas morais profundas, demônios recrutáveis e múltiplos finais, o jogo coloca o destino do mundo nas mãos do jogador.",
    year: 2017,
    platform: "Nintendo 3DS",
    tags: ["JRPG", "Turn-Based", "Demon Fusion", "Sci-Fi", "Dungeon Crawler"],
    image: {
      src: "/images/shin-megami-tensei-strange-journey-redux.jpeg",
      alt: "Shin Megami Tensei: Strange Journey Redux (3DS)",
    },
  },
  {
    slug: "shin-megami-tensei-overclocked",
    title: "Shin Megami Tensei: Devil Survivor Overclocked",
    shortDescription:
      "RPG tático em sete dias de caos, decisões difíceis e múltiplos finais.",
    fullDescription:
      "Presos em Tóquio durante um misterioso bloqueio sobrenatural, jovens devem sobreviver a sete dias de caos. Com batalhas estratégicas, narrativa ramificada e decisões que afetam aliados e finais, Overclocked mistura RPG tático com um clima apocalíptico intenso.",
    year: 2011,
    platform: "Nintendo 3DS",
    tags: ["SRPG", "JRPG", "Apocalyptic", "Branching Story", "Demon Fusion"],
    image: {
      src: "/images/shin-megami-tensei-overclocked.jpeg",
      alt: "Shin Megami Tensei: Devil Survivor Overclocked (3DS)",
    },
  },
  {
    slug: "shin-megami-tensei-iv",
    title: "Shin Megami Tensei IV",
    shortDescription:
      "Escolhas entre lei, caos e neutralidade em um JRPG desafiador no 3DS.",
    fullDescription:
      "Situado entre o reino medieval de Mikado e uma Tóquio devastada, Shin Megami Tensei IV desafia o jogador a decidir entre lei, caos ou neutralidade. Com combate exigente, fusão profunda de demônios e escolhas filosóficas que moldam o mundo, o jogo é considerado um dos marcos da série no Nintendo 3DS.",
    year: 2013,
    platform: "Nintendo 3DS",
    tags: ["JRPG", "Turn-Based", "Demon Fusion", "Philosophical", "Dark Fantasy"],
    image: {
      src: "/images/shin-megami-tensei-iv.jpeg",
      alt: "Shin Megami Tensei IV (3DS)",
    },
  },
  {
    slug: "shin-megami-tensei-iv-apocalypse",
    title: "Shin Megami Tensei IV: Apocalypse",
    shortDescription:
      "Combate refinado e narrativa focada em personagens num cenário pós-apocalíptico.",
    fullDescription:
      "Uma releitura alternativa dos eventos de SMT IV, Apocalypse foca em personagens mais humanos e relações interpessoais. Com sistema de combate refinado e narrativa centrada em amizade e sacrifício, o jogo aprofunda o conflito entre deuses e humanidade.",
    year: 2016,
    platform: "Nintendo 3DS",
    tags: ["JRPG", "Turn-Based", "Demon Fusion", "Post-Apocalyptic", "Character-Driven"],
    image: {
      src: "/images/shin-megami-tensei-iv-apocalypse.jpeg",
      alt: "Shin Megami Tensei IV: Apocalypse (3DS)",
    },
  },
  {
    slug: "shin-megami-tensei-devil-survivor2",
    title: "Shin Megami Tensei: Devil Survivor 2 Record Breaker",
    shortDescription:
      "Tático com demônios e rotas narrativas contra os Septentriones.",
    fullDescription:
      "A humanidade enfrenta invasores conhecidos como Septentriones enquanto o tempo se esgota. Com batalhas táticas, demônios invocáveis e múltiplas rotas narrativas, Devil Survivor 2 explora desespero, esperança e o preço da sobrevivência.",
    year: 2015,
    platform: "Nintendo 3DS",
    tags: ["SRPG", "JRPG", "Branching Story", "Apocalyptic", "Demon Fusion"],
    image: {
      src: "/images/shin-megami-tensei-devil-survivor2.jpeg",
      alt: "Shin Megami Tensei: Devil Survivor 2 Record Breaker (3DS)",
    },
  },
];
