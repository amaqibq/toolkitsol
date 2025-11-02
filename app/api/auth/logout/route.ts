export async function POST() {
	const headers = new Headers();
	headers.append(
		"Set-Cookie",
		"admin_auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
	);
	return new Response(JSON.stringify({ ok: true }), { headers });
}







