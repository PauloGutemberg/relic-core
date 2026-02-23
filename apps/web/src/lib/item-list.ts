export type ItemListDTO = {
  slug: string;
  title: string;
  shortDescription: string;
  image: { src: string; alt: string };
  year: number;
  platform: string;
  tags: string[];
};
