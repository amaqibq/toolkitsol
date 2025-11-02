import { BlogPost } from "@/lib/blog";

export function BlogMeta({ post }: { post: BlogPost }) {
	return (
		<div className="mb-6">
			<p className="text-sm text-muted-foreground">
				{new Date(post.date).toLocaleDateString()}
				{post.author ? ` • ${post.author}` : ""}
			</p>
			{(post.categories?.length ?? 0) > 0 ? (
				<div className="flex flex-wrap gap-2 mt-2">
					{post.categories!.map((c) => (
						<span key={c} className="text-xs px-2 py-1 border rounded">
							{c}
						</span>
					))}
				</div>
			) : null}
		</div>
	);
}



