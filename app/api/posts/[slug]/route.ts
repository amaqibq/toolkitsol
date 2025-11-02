import { NextRequest } from "next/server";
import { readPostBySlug, updatePost, deletePost } from "@/lib/blog";
import { isDbEnabled } from "@/lib/db";
import {
	dbGetPost,
	dbUpdatePost,
	dbDeletePost,
} from "@/lib/blog-db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_: NextRequest, { params }: Params) {
	const { slug } = await params;

	const post = isDbEnabled()
		? await dbGetPost(slug)
		: readPostBySlug(slug);

	if (!post)
		return Response.json({ error: "Not found" }, { status: 404 });

	return Response.json(post);
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const { slug } = await params;
		const body = await req.json();

		const updated = isDbEnabled()
			? await dbUpdatePost(slug, body)
			: updatePost(slug, body);

		return Response.json(updated);
	} catch (e: any) {
		return Response.json(
			{ error: e?.message ?? "Failed to update" },
			{ status: 400 }
		);
	}
}

export async function DELETE(_: NextRequest, { params }: Params) {
	const { slug } = await params;

	const ok = isDbEnabled()
		? await dbDeletePost(slug)
		: deletePost(slug);

	return Response.json({ ok });
}
