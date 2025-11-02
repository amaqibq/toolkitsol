import { NextRequest } from "next/server";
import { getDb, schemaSql } from "@/lib/db";

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}));
	const password = process.env.ADMIN_PASSWORD ?? "admin123";
	if (body.password !== password) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	}
    const sql = getDb();
    if (!sql) return new Response(JSON.stringify({ error: "DATABASE_URL not configured" }), { status: 400 });
    // Run raw multi-statement schema using Neon unsafe mode
    // @ts-ignore - .unsafe exists on neon client
    await sql.unsafe(schemaSql);
	return Response.json({ ok: true });
}


