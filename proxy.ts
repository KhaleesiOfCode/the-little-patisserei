import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" || pathname.startsWith("/order/confirmation")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("__session");
  if (!session) {
    const url = new URL("/", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/|static/|favicon.ico|home/).*)",
  ],
};
