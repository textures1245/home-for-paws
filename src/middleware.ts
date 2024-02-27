import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const authCookie = req.cookies.get("AuthorizationToken");
  if (!process.env.NEXT_PUBLIC_JWT_SECRET)
    throw new Error("JWT secret not found");
  if (authCookie) {
    const authToken = authCookie.value.split(" ")[1];
    try {
      const jwtAuth = jwt.verify(
        authToken,
        process.env.NEXT_PUBLIC_JWT_SECRET || ""
      );

      if (!jwtAuth) throw new Error("token not found or invalid");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch (error) {}
  } else {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],

};
