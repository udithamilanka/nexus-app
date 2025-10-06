import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTPayload } from "./types/user";

function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Define routes
  const protectedRoot = "/dashboard";
  const isProtectedRoute = pathname.startsWith(protectedRoot);
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.includes(pathname);

  // 🔒 Require login for dashboard routes
  if (isProtectedRoute) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    const decoded = decodeJWT(token);

    if (!decoded) return NextResponse.redirect(new URL("/login", request.url));

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now)
      return NextResponse.redirect(new URL("/login", request.url));

    const role = decoded.role;

    // Define role access map
    const roleAccessMap: Record<string, string[]> = {
      "/dashboard/qa-deployments": ["admin", "qa"],
      "/dashboard/prod-deployments": ["admin", "devops"],
      "/dashboard/dev-deployments": ["admin", "developer"],
      "/dashboard/users": ["admin"],
      "/dashboard/reports": ["admin"],
      "/dashboard/settings": ["admin"],
    };

    // Find the route restriction that matches most specifically
    const matchedRoute = Object.keys(roleAccessMap).find((route) =>
      pathname === route || pathname.startsWith(route + "/")
    );

    // If route is restricted and user role is not allowed → redirect
    if (matchedRoute) {
      const allowedRoles = roleAccessMap[matchedRoute];
      if (!allowedRoles.includes(role)) {
        console.warn(`Access denied: ${role} -> ${pathname}`);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  // 🚫 Prevent logged-in users from visiting /login or /signup
  if (isAuthRoute && token) {
    const decoded = decodeJWT(token);
    if (decoded) {
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp >= now) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
