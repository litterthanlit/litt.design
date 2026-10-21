import type { NextRequest } from "next/server";

/**
 * Preview-only stand-in for the /art rewrite (see next.config.ts). Gallery
 * preview deployments sit behind Vercel Authentication, so this fetches them
 * with the project's protection-bypass secret as a header — as a query param
 * it would be echoed into the page. Production never sets GALLERY_BYPASS, so
 * there /art is a plain rewrite and this route 404s.
 */

// Hop-by-hop headers, plus encoding/length: fetch decompresses the body.
const DROPPED = ["connection", "keep-alive", "transfer-encoding", "host", "content-length", "content-encoding", "accept-encoding"];

type Context = { params: Promise<{ path?: string[] }> };

async function forward(request: NextRequest, { params }: Context): Promise<Response> {
  const bypass = process.env.GALLERY_BYPASS;
  const origin = process.env.GALLERY_URL;
  if (!bypass || !origin) return new Response("Not found", { status: 404 });

  const { path = [] } = await params;
  const rest = path.map(encodeURIComponent).join("/");
  const target = new URL(`/art${rest ? `/${rest}` : ""}${request.nextUrl.search}`, origin);

  const headers = new Headers(request.headers);
  for (const name of DROPPED) headers.delete(name);
  headers.set("x-vercel-protection-bypass", bypass);

  const upstream = await fetch(target, {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  });

  const responseHeaders = new Headers(upstream.headers);
  for (const name of DROPPED) responseHeaders.delete(name);
  // Keep redirects on this domain.
  const location = responseHeaders.get("location");
  if (location?.startsWith(origin)) {
    responseHeaders.set("location", location.slice(origin.length) || "/");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

// The gallery is read-only: no forms or server actions to pass a body for.
export const GET = forward;
export const HEAD = forward;
