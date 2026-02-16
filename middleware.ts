import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname.toLowerCase();
    const token = req.nextauth.token;
    const role = token?.role;

    const publicRoutes = ["/", "/login", "/register", "/about", "/portfolio"];
    const publicApiRoutes = ["/api/public-data", "/api/blogs"];

    const adminApiRoutes = [
      "/api/orders/allOrders",
      "/api/portfolio/updatePortfolio",
    ];

    // ✅ Allow public pages & API without auth
    if (
      publicRoutes.includes(pathname) ||
      publicApiRoutes.includes(pathname) ||
      pathname.startsWith("/api/auth")
    ) {
      return NextResponse.next();
    }

    // ❌ No token = unauthenticated → redirect to login
   if (!token) {
  const redirectTo = req.nextUrl.pathname + req.nextUrl.search;
  return NextResponse.redirect(new URL(`/login?redirect=${redirectTo}`, req.url));
}

    // console.log("🔐 Middleware hit:", pathname, "| Role:", role);

    // ✅ Admin-only routes
    if (pathname.startsWith("/dashboard/admin") && role === "admin") {
      return NextResponse.next();
    }

    if (adminApiRoutes.includes(pathname) && role === "admin") {
      return NextResponse.next();
    }

    if (pathname.startsWith("/user") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ User-only routes
    if (
      (pathname.startsWith("/dashboard/user") ||
        pathname.startsWith("/api/user") ||
        pathname.startsWith("/user")) &&
      (role === "user" || role === "admin")
    ) {
      return NextResponse.next();
    }

    // ✅ Common dashboard access for admin & user
    if (pathname === "/dashboard" && (role === "admin" || role === "user")) {
      return NextResponse.next();
    }

    // ❌ Unauthorized fallback
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const path = req.nextUrl.pathname.toLowerCase();

        const publicRoutes = [
          "/",
          "/login",
          "/register",
          "/about",
          "/portfolio",
        ];
        const publicApiRoutes = ["/api/public-data", "/api/blogs"];

        // ✅ Allow public access without token
        if (
          publicRoutes.includes(path) ||
          publicApiRoutes.includes(path) ||
          path.startsWith("/api/auth")
        ) {
          return true;
        }

        // ✅ Allow private access only if token exists
        return !!token;
      },
    },
  }
);

// ✅ Middleware active on dashboard and API routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/user/:path*"],
};