import { NextResponse } from "next/server";

export function proxy(request) {
  const isLoggedIn = request.cookies.get("qs-auth")?.value === "true";
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}