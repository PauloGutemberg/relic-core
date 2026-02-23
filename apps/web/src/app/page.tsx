import { HomePage } from "@/app/(public)/home";

export const dynamic = "force-static"; // Home gerada no build (SSG)

export default function Page() {
  return <HomePage />;
}
