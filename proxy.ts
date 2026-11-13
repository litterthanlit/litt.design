import { NextResponse, type NextRequest } from "next/server";

/**
 * Trailing slashes, by hand (next.config.ts sets skipTrailingSlashRedirect).
 * /systems/ is the litt.md gallery, which loads its files relative to its page,
 * so it keeps its slash and /systems gains one. Every other path loses its
 * slash, as Next did by default.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/systems") return redirect(request, "/systems/");
  if (pathname !== "/" && pathname.endsWith("/") && !pathname.startsWith("/systems/")) {
    return redirect(request, pathname.replace(/\/+$/, "") || "/");
  }
}

function redirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Pages only: never Next's own files or anything with a file extension.
  matcher: ["/((?!_next/|.*\\.\\w+$).*)"],
};
