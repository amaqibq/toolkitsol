import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}));
	const password = process.env.ADMIN_PASSWORD ?? "admin123";
	if (body.password !== password) {
		return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
	}
	const headers = new Headers();
	headers.append(
		"Set-Cookie",
		`admin_auth=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}`
	);
	return new Response(JSON.stringify({ ok: true }), { headers });
}






