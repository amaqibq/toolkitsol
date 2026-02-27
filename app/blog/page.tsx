import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ToolKitSol Blog – Tips, Guides & Updates",
  description: "Read tutorials, tips and product updates from ToolKitSol about image tools, productivity and web workflows.",
  alternates: {
    canonical: "/blog",
  },
};

type Post = {
	slug: string;
	title: string;
	excerpt?: string;
	date?: string;
	coverImage?: string;
};

export default async function BlogPage() {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/posts`,
		{ next: { revalidate: 0 } }
	);

	if (!res.ok) {
		return (
			<div className="container mx-auto px-4 py-10 text-center">
				<h1 className="text-2xl font-semibold">Error loading posts</h1>
			</div>
		);
	}

	const posts: Post[] = await res.json();

	if (!posts || posts.length === 0) {
		return (
			<div className="container mx-auto px-4 py-10 text-center">
				<h1 className="text-2xl font-semibold">No posts found</h1>
				<p className="text-muted-foreground mt-2">
					Create your first post using the API or admin interface.
				</p>
			</div>
		);
	}

	return (
		<section className="container mx-auto px-4 py-10">
			<h1 className="text-4xl font-bold mb-8">Latest Posts</h1>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{posts.map((post) => (
					<Link
						key={post.slug}
						href={`/blog/${post.slug}`}
						className="block border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
					>
						{post.coverImage && (
							<div className="aspect-video relative">
								<Image
									src={post.coverImage}
									alt={post.title}
									fill
									className="object-cover"
								/>
							</div>
						)}

						<div className="p-5">
							<h2 className="text-xl font-semibold mb-2">{post.title}</h2>

							{post.date && (
								<p className="text-sm text-muted-foreground mb-2">
									{new Date(post.date).toLocaleDateString()}
								</p>
							)}

							<p className="text-muted-foreground line-clamp-3">
								{post.excerpt || "No excerpt available."}
							</p>

							<span className="text-primary font-medium mt-3 inline-block">
								Read More →
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
