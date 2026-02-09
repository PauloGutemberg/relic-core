// apps/web/src/app/page.tsx
import { HomePage } from "../features/home";

export const dynamic = "force-static"; // Home gerada no build (SSG)

export default function Page() {
  return <HomePage />;
}
