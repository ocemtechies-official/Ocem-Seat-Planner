import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/reset-password", "/update-password"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Auth callback route (special handling)
  if (pathname.startsWith("/auth/callback")) {
    return supabaseResponse;
  }

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access public route
  if (user && isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Get user role for role-based routing
  if (user) {
    // Role-specific route protection can be added here
    // For now, we'll let the client-side handle detailed role checks

    // Example: Admin-only routes
    if (pathname.startsWith("/admin")) {
      // This would require fetching the role from the database
      // For simplicity, we'll handle this client-side
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
