import { Container } from "../../../shared/ui/container/Container";
import { fetchItems } from "../api/home.client";
import styles from "../styles/HomePage.module.css";
import { ProfileShortcut } from "../../../shared/ui/profile/profile.shortcut";
import { HomeFilters } from "./HomeFilters";

export async function HomePage() {
  const items = await fetchItems();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerRow}>
            <div className={styles.brand}>
              <h1 className={styles.title}>save point</h1>
              <p className={styles.subtitle}>
                Sua coleção pessoal de jogos — organizada, preservada e pronta para ser lembrada.
              </p>
            </div>

            <div className={styles.meta}>
              <ProfileShortcut />
            </div>
          </div>
          <HomeFilters items={items} />
        </Container>
      </header>

   
    </div>
  );
}
