export type ItemDetailDTO = {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  year: number;
  platform: string;
  image: { src: string; alt: string };
  tags: string[];
};