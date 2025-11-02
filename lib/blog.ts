import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BlogFrontmatter = {
	title: string;
	slug: string;
	date: string; // ISO date string
	excerpt?: string;
	coverImage?: string;
	author?: string;
	categories?: string[];
	tags?: string[];
	metaTitle?: string;
	metaDescription?: string;
	canonicalUrl?: string;
	isIndexed?: boolean; // false => noindex
};

export type BlogPost = BlogFrontmatter & {
	content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function ensureBlogDir() {
	if (!fs.existsSync(BLOG_DIR)) {
		fs.mkdirSync(BLOG_DIR, { recursive: true });
	}
}

export function getAllPostSlugs(): string[] {
	if (!fs.existsSync(BLOG_DIR)) return [];
	return fs
		.readdirSync(BLOG_DIR)
		.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
		.map((file) => file.replace(/\.(md|mdx)$/i, ""));
}

export function readPostBySlug(slug: string): BlogPost | null {
	const mdPathMd = path.join(BLOG_DIR, `${slug}.md`);
	const mdPathMdx = path.join(BLOG_DIR, `${slug}.mdx`);
	const filePath = fs.existsSync(mdPathMd) ? mdPathMd : fs.existsSync(mdPathMdx) ? mdPathMdx : null;
	if (!filePath) return null;
	const file = fs.readFileSync(filePath, "utf8");
	const { data, content } = matter(file);
	const fm = data as Partial<BlogFrontmatter>;
	const frontmatter: BlogFrontmatter = {
		title: fm.title ?? slug,
		slug: fm.slug ?? slug,
		date: fm.date ?? new Date().toISOString(),
		excerpt: fm.excerpt ?? "",
		coverImage: fm.coverImage ?? "",
		author: fm.author ?? "",
		categories: fm.categories ?? [],
		tags: fm.tags ?? [],
		metaTitle: fm.metaTitle ?? fm.title ?? slug,
		metaDescription: fm.metaDescription ?? fm.excerpt ?? "",
		canonicalUrl: fm.canonicalUrl ?? undefined,
		isIndexed: typeof fm.isIndexed === "boolean" ? fm.isIndexed : false,
	};
	return { ...frontmatter, content };
}

export function getAllPosts(): BlogPost[] {
	return getAllPostSlugs()
		.map((slug) => readPostBySlug(slug))
		.filter((p): p is BlogPost => Boolean(p))
		.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function paginatePosts(posts: BlogPost[], page: number, pageSize: number) {
	const total = posts.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const start = (currentPage - 1) * pageSize;
	const end = start + pageSize;
	return {
		items: posts.slice(start, end),
		page: currentPage,
		total,
		totalPages,
		pageSize,
	};
}

export function filterPosts(posts: BlogPost[], opts: { query?: string; category?: string }) {
	const { query, category } = opts;
	const q = (query ?? "").trim().toLowerCase();
	const c = (category ?? "").trim().toLowerCase();
	return posts.filter((p) => {
		const matchesQuery = q
			? [p.title, p.excerpt, p.content, ...(p.tags ?? []), ...(p.categories ?? [])]
				.filter(Boolean)
				.some((field) => String(field).toLowerCase().includes(q))
		: true;
		const matchesCategory = c ? (p.categories ?? []).some((cat) => String(cat).toLowerCase() === c) : true;
		return matchesQuery && matchesCategory;
	});
}

export function getAllCategories(posts?: BlogPost[]): string[] {
	const list = (posts ?? getAllPosts()).flatMap((p) => p.categories ?? []);
	return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
}

export function writePostToMarkdown(post: BlogPost) {
	ensureBlogDir();
	const safeSlug = post.slug.trim();
	const filePath = path.join(BLOG_DIR, `${safeSlug}.md`);
	const frontmatter: BlogFrontmatter = {
		title: post.title,
		slug: safeSlug,
		date: post.date,
		excerpt: post.excerpt ?? "",
		coverImage: post.coverImage ?? "",
		author: post.author ?? "",
		categories: post.categories ?? [],
		tags: post.tags ?? [],
		metaTitle: post.metaTitle ?? post.title,
		metaDescription: post.metaDescription ?? post.excerpt ?? "",
		canonicalUrl: post.canonicalUrl ?? undefined,
		isIndexed: typeof post.isIndexed === "boolean" ? post.isIndexed : false,
	};
	const md = matter.stringify(post.content ?? "", frontmatter as Record<string, unknown>);
	fs.writeFileSync(filePath, md, "utf8");
	return filePath;
}

export function createPost(data: Partial<BlogPost>): BlogPost {
	if (!data.slug || !data.title) {
		throw new Error("Missing required fields: title and slug");
	}
	const nowIso = new Date().toISOString();
	const post: BlogPost = {
		title: data.title,
		slug: data.slug,
		date: data.date ?? nowIso,
		excerpt: data.excerpt ?? "",
		coverImage: data.coverImage ?? "",
		author: data.author ?? "",
		categories: data.categories ?? [],
		tags: data.tags ?? [],
		metaTitle: data.metaTitle ?? data.title,
		metaDescription: data.metaDescription ?? data.excerpt ?? "",
		content: data.content ?? "",
	};
	if (readPostBySlug(post.slug)) {
		throw new Error("Post with this slug already exists");
	}
	writePostToMarkdown(post);
	return post;
}

export function updatePost(slug: string, updates: Partial<BlogPost>): BlogPost {
	const existing = readPostBySlug(slug);
	if (!existing) throw new Error("Post not found");
	const merged: BlogPost = {
		...existing,
		...updates,
		slug: updates.slug ?? existing.slug,
		title: updates.title ?? existing.title,
		date: updates.date ?? existing.date,
		content: updates.content ?? existing.content,
	};
	// If slug changed, delete old file after writing new one
	writePostToMarkdown(merged);
	if (merged.slug !== slug) {
		const oldPath = path.join(BLOG_DIR, `${slug}.md`);
		if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
	}
	return merged;
}

export function deletePost(slug: string): boolean {
	const mdPath = path.join(BLOG_DIR, `${slug}.md`);
	const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
	if (fs.existsSync(mdPath)) {
		fs.unlinkSync(mdPath);
		return true;
	}
	if (fs.existsSync(mdxPath)) {
		fs.unlinkSync(mdxPath);
		return true;
	}
	return false;
}


