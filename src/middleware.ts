import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // Redirect to /dashboard if token exists and user is trying to access auth or public pages
    if (
        token &&
        (url.pathname.startsWith("/sign-in") ||
            url.pathname.startsWith("/sign-up") ||
            url.pathname.startsWith("/verify"))
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Allow access to the dashboard if token exists, do not redirect
    if (token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.next();
    }

    // Redirect to /sign-in if no token exists and trying to access protected pages
    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/sign-in",
        "/sign-up",
        "/",
        "/dashboard/:path*",
        "/verify/:path*",
    ],
};

export { default } from "next-auth/middleware";
