import Image from "next/image";
import Link from "next/link";
import type { ItemListDTO } from "../types";
import styles from "../styles/ItemCard.module.css";

export function ItemCard({ item }: { item: ItemListDTO }) {
  return (
    <Link href={`/items/${item.slug}`} className={styles.link}>
      <article className={styles.card}>
        <div className={styles.imageWrap}>
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw"
            className={styles.image}
          />
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.desc}>{item.shortDescription}</p>
        </div>
      </article>
    </Link>
  );
}
