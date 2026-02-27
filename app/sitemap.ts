import { MetadataRoute } from "next"
import { promises as fs } from "fs"
import path from "path"
import { BASE_URL, TOOL_SEO_CONFIG } from "@/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date()

  // ✅ Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  // ✅ Dynamic tools: automatically include all /tools/* pages that have a page.tsx
  const toolsDir = path.join(process.cwd(), "app", "tools")
  let toolRoutes: MetadataRoute.Sitemap = []

  try {
    const entries = await fs.readdir(toolsDir, { withFileTypes: true })

    const toolPaths = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const pagePath = path.join(toolsDir, entry.name, "page.tsx")
          try {
            await fs.access(pagePath)
            return entry.name
          } catch {
            return null
          }
        }),
    )

    toolRoutes =
      toolPaths
        .filter((slug): slug is string => Boolean(slug))
        .map((slug) => {
          const config = TOOL_SEO_CONFIG[slug as keyof typeof TOOL_SEO_CONFIG]

          return {
            url: `${BASE_URL}/tools/${slug}`,
            lastModified: currentDate,
            changeFrequency: "weekly",
            priority: config ? 0.9 : 0.8,
          }
        }) ?? []
  } catch (error) {
    console.error("Error building tools sitemap:", error)
  }

  // ✅ Dynamic Blog Posts (unchanged logic, just using BASE_URL)
  let blogPosts: { slug: string; date?: string }[] = []

  try {
    const res = await fetch(`${BASE_URL}/api/posts`, {
      next: { revalidate: 3600 }, // 1 hour cache
    })

    if (res.ok) {
      blogPosts = await res.json()
    }
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error)
  }

  const blogRoutes: MetadataRoute.Sitemap =
    blogPosts?.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    })) || []

  return [...staticRoutes, ...toolRoutes, ...blogRoutes]
}