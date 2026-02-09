import Image from "next/image";
import Link from "next/link";
import { Container } from "../../../shared/ui/container/Container";
import type { ItemDetailDTO } from "../types";
import styles from "../styles/ItemDetailPage.module.css";

export function ItemDetailPage({ item }: { item: ItemDetailDTO }) {
  return (
    <main className={styles.page}>
      <Container>
        <div className={styles.stack}>
          <Link href="/" className={styles.backLink}>
            ← Voltar para a coleção
          </Link>

          <h1 className={styles.title}>{item.title}</h1>

          <div className={styles.meta}>
            <span>{item.platform}</span>
            <span className={styles.dot}>•</span>
            <span>{item.year}</span>
          </div>

          <div className={styles.tags}>
            {item.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className={styles.hero}>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(max-width: 1100px) 100vw, 900px"
              className={styles.heroImage}
              priority
            />
          </div>

          <p className={styles.fullDescription}>{item.fullDescription}</p>
        </div>
      </Container>
    </main>
  );
}