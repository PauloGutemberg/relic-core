import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "session";

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

// Pega o ÚLTIMO cookie "session=" do header (resiliente a duplicados)
function getLastCookieValue(req: NextRequest, name: string): string | null {
  const header = req.headers.get("cookie");
  if (!header) return null;

  let found: string | null = null;
  for (const part of header.split(";")) {
    const s = part.trim();
    if (s.startsWith(name + "=")) {
      const v = s.slice(name.length + 1);
      if (v) found = v;
    }
  }
  return found;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublicAsset(pathname)) return NextResponse.next();

  // Alias opcional: /me -> /profile (evita 404 se sobrar link antigo)
  if (pathname === "/me") {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  const isPrivate = pathname.startsWith("/profile");
  const isLogin = pathname === "/login";

  const sessionValue = getLastCookieValue(req, COOKIE_NAME);
  const hasSession = !!sessionValue;

  // Header de debug (pra você ver no DevTools se o middleware enxergou cookie)
  const next = NextResponse.next();
  next.headers.set("x-mw-has-session", hasSession ? "1" : "0");

  if (isPrivate && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("returnTo", pathname + search);
    return NextResponse.redirect(url);
  }

  if (isLogin && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return next;
}

export const config = {
  matcher: ["/profile/:path*", "/login", "/me"],
};