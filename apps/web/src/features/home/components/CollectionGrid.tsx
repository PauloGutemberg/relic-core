import type { ItemListDTO } from "../types";
import { ItemCard } from "./ItemCard";
import styles from "../styles/CollectionGrid.module.css";

export function CollectionGrid({ items }: { items: ItemListDTO[] }) {
  return (
    <section className={styles.grid} aria-label="Itens da coleção">
      {items.map((item) => (
        <ItemCard key={item.slug} item={item} />
      ))}
    </section>
  );
}
