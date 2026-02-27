import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Calendar, User, ArrowLeft, Clock, Tag } from "lucide-react";
import { buildBlogPostingJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Post = {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  date?: string;
  author?: string;
  coverImage?: string;
  categories?: string[];
  readTime?: number;
};

// ✅ Fetch single post
async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/posts/${slug}`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ✅ Fetch all posts
async function getAllPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/posts`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ✅ Calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// ✅ Metadata (await params)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt ?? "",
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

// ✅ Blog Post Page
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return notFound();

  const allPosts = await getAllPosts();
  const readTime = post.readTime || calculateReadingTime(post.content);

  // Related posts (based on categories)
  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .filter((p) => post.categories?.some((c) => p.categories?.includes(c)))
    .slice(0, 3);

  // fallback if no category match
  const fallbackRelated =
    related.length > 0
      ? related
      : allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="min-h-screen bg-background text-foreground">
      <Script
        id={`ld-blog-${post.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBlogPostingJsonLd(post)) }}
      />
      {/* --- Hero Section --- */}
      <section className="relative w-full h-[280px] md:h-[400px] bg-gradient-to-br from-slate-900 to-slate-700">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="max-w-3xl mx-auto">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.slice(0, 3).map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/30"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {category}
                    </span>
                  ))}
                </div>
              )}
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm md:text-base">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                )}
                {post.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Content Section --- */}
      <section className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-accent rounded-lg mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        {/* Content Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 md:p-8 lg:p-10">
          <ReactMarkdown
            className="prose prose-lg dark:prose-invert max-w-none 
                      prose-headings:font-semibold
                      prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                      prose-p:text-foreground/90 prose-p:leading-relaxed
                      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                      prose-blockquote:border-l-4 prose-blockquote:border-primary
                      prose-blockquote:bg-muted prose-blockquote:px-6 prose-blockquote:py-2
                      prose-blockquote:rounded-r-lg
                      prose-ul:list-disc prose-ol:list-decimal
                      prose-li:marker:text-primary
                      prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5
                      prose-code:rounded prose-code:text-sm
                      prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
                      prose-table:border prose-table:border-border
                      prose-th:bg-muted prose-th:font-semibold
                      prose-td:border prose-td:border-border"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              img: ({ node, ...props }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  {...props}
                  className="max-w-full h-auto rounded-xl my-8 shadow-md border border-border"
                  loading="lazy"
                  alt={props.alt || "Blog post image"}
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* --- Bottom Meta --- */}
        <div className="mt-8 text-center text-muted-foreground text-sm">
          <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
            <Calendar className="w-4 h-4" />
            Last updated on{" "}
            {new Date(post.date ?? "").toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </section>

      {/* --- Related Posts Section --- */}
      {fallbackRelated.length > 0 && (
        <section className="bg-muted/20 py-16 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                You Might Also Like
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Discover more articles that might interest you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fallbackRelated.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group bg-card border border-border rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {item.coverImage && (
                    <div className="relative w-full h-48">
                      <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    {item.categories && item.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.categories.slice(0, 2).map((category) => (
                          <span
                            key={category}
                            className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {item.excerpt || "Read more..."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {item.date && (
                        <time>
                          {new Date(item.date).toLocaleDateString()}
                        </time>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readTime || calculateReadingTime(item.content)} min read
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}