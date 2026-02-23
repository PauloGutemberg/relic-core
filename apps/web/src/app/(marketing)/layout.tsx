import type { ReactNode } from "react";
import { Footer } from "@/components/footer/footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}