import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.toolkitsol.com"

  // ✅ Static routes (main, blog, tools)
  const staticRoutes = [
    "",
    "/blog",
    "/tools",
    "/tools/image-converter",
    "/tools/image-compressor",
    "/tools/image-resizer",
    "/tools/image-watermark",
    "/tools/background-remover",
    "/tools/content-counter",
    "/tools/qr-generator",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }))

  // ✅ Dynamic blog posts (optional, if your /api/posts returns blog list)
  let blogPosts: { slug: string; date?: string }[] = []
  try {
    const res = await fetch(`${baseUrl}/api/posts`, { next: { revalidate: 60 } })
    if (res.ok) {
      blogPosts = await res.json()
    }
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error)
  }

  const blogRoutes =
    blogPosts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || []

  return [...staticRoutes, ...blogRoutes]
}
