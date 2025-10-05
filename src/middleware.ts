import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple JWT decode without verification (for middleware)
function decodeJWT(token: string): { userId: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );
    
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Public routes (redirect to dashboard if already logged in)
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Decode and check expiration
    const decoded = decodeJWT(token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Token is valid and not expired
  }

  if (isAuthRoute) {
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp >= now) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};