import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter store for IP addresses
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminPath = process.env.ADMIN_ROUTE_PATH || "dashboard-x7k92m-admin";

  // Rate Limiting: max 5 requests per 1 minute window for Login and API contact form
  if (
    (pathname === `/${adminPath}/login` && request.method === "POST") ||
    pathname.startsWith("/api/contact")
  ) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const limit = 5;
    const windowMs = 60 * 1000;

    const clientRate = rateLimitStore.get(ip);

    if (!clientRate) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      if (now > clientRate.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      } else {
        clientRate.count++;
        if (clientRate.count > limit) {
          return new NextResponse(
            JSON.stringify({ success: false, message: "Too many requests. Please try again in a minute." }),
            { status: 429, headers: { "content-type": "application/json" } }
          );
        }
      }
    }
  }

  // Check if current path belongs to the hidden admin path
  const isAdminPath = pathname.startsWith(`/${adminPath}`);

  if (isAdminPath) {
    // NextAuth session token cookies (support local HTTP and production HTTPS)
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    const isAuthenticated = !!sessionToken;
    const isLoginPath = pathname === `/${adminPath}/login` || pathname === `/${adminPath}/login/`;

    if (isLoginPath) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL(`/${adminPath}/dashboard`, request.url));
      }
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/${adminPath}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, optimized images, favicons, or public uploads.
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|uploads|images).*)",
  ],
};
