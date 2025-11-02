import { getDb } from "@/lib/db";
import type { BlogPost } from "@/lib/blog";

export async function dbGetAllPosts(): Promise<BlogPost[]> {
	const sql = getDb();
	if (!sql) return [];

	const rows: any[] = await sql`
		select slug, title, content, excerpt, cover_image, author, categories, tags,
		       meta_title, meta_description, canonical_url, is_indexed, published_at, updated_at
		from posts
		order by published_at desc
	`;

	return rows.map((r) => ({
		slug: r.slug,
		title: r.title,
		content: r.content ?? "",
		excerpt: r.excerpt ?? "",
		coverImage: r.cover_image ?? "",
		author: r.author ?? "",
		categories: r.categories ?? [],
		tags: r.tags ?? [],
		metaTitle: r.meta_title ?? undefined,
		metaDescription: r.meta_description ?? undefined,
		canonicalUrl: r.canonical_url ?? undefined,
		isIndexed: Boolean(r.is_indexed),
		date: r.published_at,
	}));
}

export async function dbGetPost(slug: string): Promise<BlogPost | null> {
	const sql = getDb();
	if (!sql) return null;

	const rows: any[] = await sql`
		select slug, title, content, excerpt, cover_image, author, categories, tags,
		       meta_title, meta_description, canonical_url, is_indexed, published_at, updated_at
		from posts
		where slug = ${slug}
		limit 1
	`;

	const r = rows[0];
	if (!r) return null;

	return {
		slug: r.slug,
		title: r.title,
		content: r.content ?? "",
		excerpt: r.excerpt ?? "",
		coverImage: r.cover_image ?? "",
		author: r.author ?? "",
		categories: r.categories ?? [],
		tags: r.tags ?? [],
		metaTitle: r.meta_title ?? undefined,
		metaDescription: r.meta_description ?? undefined,
		canonicalUrl: r.canonical_url ?? undefined,
		isIndexed: Boolean(r.is_indexed),
		date: r.published_at,
	};
}

export async function dbCreatePost(data: Partial<BlogPost>): Promise<BlogPost> {
	const sql = getDb();
	if (!sql) throw new Error("DB not configured");
	const now = new Date().toISOString();

	const rows: any[] = await sql`
		insert into posts (
			slug, title, content, excerpt, cover_image, author, categories, tags,
			meta_title, meta_description, canonical_url, is_indexed, published_at, updated_at
		) values (
			${data.slug!}, ${data.title!}, ${data.content ?? ""}, ${data.excerpt ?? ""}, 
			${data.coverImage ?? ""}, ${data.author ?? ""}, ${data.categories ?? []}, ${data.tags ?? []}, 
			${data.metaTitle ?? null}, ${data.metaDescription ?? null}, ${data.canonicalUrl ?? null}, 
			${Boolean(data.isIndexed)}, ${data.date ?? now}, ${now}
		)
		returning slug, title, content, excerpt, cover_image, author, categories, tags,
		          meta_title, meta_description, canonical_url, is_indexed, published_at, updated_at
	`;

	const r = rows[0]!;
	return {
		slug: r.slug,
		title: r.title,
		content: r.content ?? "",
		excerpt: r.excerpt ?? "",
		coverImage: r.cover_image ?? "",
		author: r.author ?? "",
		categories: r.categories ?? [],
		tags: r.tags ?? [],
		metaTitle: r.meta_title ?? undefined,
		metaDescription: r.meta_description ?? undefined,
		canonicalUrl: r.canonical_url ?? undefined,
		isIndexed: Boolean(r.is_indexed),
		date: r.published_at,
	};
}

export async function dbUpdatePost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost> {
	const sql = getDb();
	if (!sql) throw new Error("DB not configured");
	const now = new Date().toISOString();

	const rows: any[] = await sql`
		update posts set
			slug = coalesce(${updates.slug ?? null}, slug),
			title = coalesce(${updates.title ?? null}, title),
			content = coalesce(${updates.content ?? null}, content),
			excerpt = coalesce(${updates.excerpt ?? null}, excerpt),
			cover_image = coalesce(${updates.coverImage ?? null}, cover_image),
			author = coalesce(${updates.author ?? null}, author),
			categories = coalesce(${updates.categories ?? null}, categories),
			tags = coalesce(${updates.tags ?? null}, tags),
			meta_title = ${updates.metaTitle ?? null},
			meta_description = ${updates.metaDescription ?? null},
			canonical_url = ${updates.canonicalUrl ?? null},
			is_indexed = coalesce(${typeof updates.isIndexed === "boolean" ? updates.isIndexed : null}, is_indexed),
			updated_at = ${now}
		where slug = ${slug}
		returning slug, title, content, excerpt, cover_image, author, categories, tags,
		          meta_title, meta_description, canonical_url, is_indexed, published_at, updated_at
	`;

	const r = rows[0];
	if (!r) throw new Error("Not found");

	return {
		slug: r.slug,
		title: r.title,
		content: r.content ?? "",
		excerpt: r.excerpt ?? "",
		coverImage: r.cover_image ?? "",
		author: r.author ?? "",
		categories: r.categories ?? [],
		tags: r.tags ?? [],
		metaTitle: r.meta_title ?? undefined,
		metaDescription: r.meta_description ?? undefined,
		canonicalUrl: r.canonical_url ?? undefined,
		isIndexed: Boolean(r.is_indexed),
		date: r.published_at,
	};
}

export async function dbDeletePost(slug: string): Promise<boolean> {
	const sql = getDb();
	if (!sql) throw new Error("DB not configured");

	const result: any = await sql`delete from posts where slug = ${slug}`;
	return result.count ? result.count > 0 : true;
}
