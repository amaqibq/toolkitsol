import { NextRequest } from "next/server";
import { getAllPosts, createPost } from "@/lib/blog";
import { isDbEnabled } from "@/lib/db";
import { dbGetAllPosts, dbCreatePost } from "@/lib/blog-db";

export async function GET() {
	if (isDbEnabled()) {
		const posts = await dbGetAllPosts();
		return Response.json(posts);
	}
	const posts = getAllPosts();
	return Response.json(posts);
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const created = isDbEnabled() ? await dbCreatePost(body) : createPost(body);
		return Response.json(created, { status: 201 });
	} catch (e: any) {
		console.error("POST /api/posts error:", e); // 👈 ye helpful hoga
		return Response.json({ error: e?.message ?? "Failed to create" }, { status: 400 });
	}
}
