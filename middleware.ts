import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
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

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin", "/login"],
};






