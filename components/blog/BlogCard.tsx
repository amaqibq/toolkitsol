import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost } from "@/lib/blog";

export function BlogCard({ post }: { post: BlogPost }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Link href={`/blog/${post.slug}`}>{post.title}</Link>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{post.coverImage ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={post.coverImage} alt="" className="w-full h-40 object-cover rounded mb-3" />
				) : null}
				<p className="text-sm text-muted-foreground mb-2">{new Date(post.date).toLocaleDateString()}</p>
				<p className="line-clamp-3">{post.excerpt}</p>
			</CardContent>
		</Card>
	);
}



