"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "../../../features/auth/session";

export function ProfileShortcut() {
  const [href, setHref] = useState("/login");

  useEffect(() => {
    const token = getToken();
    setHref(token ? "/me" : "/login");
  }, []);

  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        textDecoration: "none",
        color: "inherit",
        fontSize: 13,
      }}
    >
      <span style={{ opacity: 0.75 }}>Perfil</span>
    </Link>
  );
}