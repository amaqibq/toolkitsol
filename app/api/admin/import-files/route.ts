import { NextRequest } from "next/server";
import { isDbEnabled } from "@/lib/db";
import { getAllPosts } from "@/lib/blog";
import { dbCreatePost, dbGetPost, dbUpdatePost } from "@/lib/blog-db";

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}));
	const password = process.env.ADMIN_PASSWORD ?? "admin123";
	const hasCookie = req.cookies.get("admin_auth")?.value === "1";
	if (!hasCookie && body.password !== password) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
	}
	if (!isDbEnabled()) {
		return new Response(JSON.stringify({ error: "DATABASE_URL not configured" }), { status: 400 });
	}

	const files = getAllPosts();
	const results: { slug: string; status: "created" | "updated" | "skipped"; error?: string }[] = [];
	for (const post of files) {
		try {
			const existing = await dbGetPost(post.slug);
			if (existing) {
				await dbUpdatePost(post.slug, {
					title: post.title,
					content: post.content,
					excerpt: post.excerpt,
					coverImage: post.coverImage,
					author: post.author,
					categories: post.categories,
					tags: post.tags,
					metaTitle: post.metaTitle,
					metaDescription: post.metaDescription,
					canonicalUrl: post.canonicalUrl,
					isIndexed: post.isIndexed,
					date: post.date,
				});
				results.push({ slug: post.slug, status: "updated" });
			} else {
				await dbCreatePost(post);
				results.push({ slug: post.slug, status: "created" });
			}
		} catch (e: any) {
			results.push({ slug: post.slug, status: "skipped", error: e?.message ?? "error" });
		}
	}

	return Response.json({ ok: true, results });
}


