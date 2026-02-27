import { NextRequest, NextResponse } from "next/server";

/**
 * Sets x-pathname header for root layout dynamic canonical URLs.
 * Also handles admin/login auth redirects.
 */
export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);

    const isAdmin = pathname.startsWith("/admin");
    const isLogin = pathname.startsWith("/login");
    const hasAuth = req.cookies.get("admin_auth")?.value === "1";

    if (isAdmin && !hasAuth) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    if (isLogin && hasAuth) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
    }

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
