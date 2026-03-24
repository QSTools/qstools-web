import { NextResponse } from "next/server";

export function middleware(request) {
  const isLoggedIn =
    request.cookies.get("qs-auth")?.value === "true";

  const url = request.nextUrl.clone();

  if (!isLoggedIn && url.pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}