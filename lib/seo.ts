export const BASE_URL = "https://www.toolkitsol.com"

export type ToolSlug =
  | "image-converter"
  | "image-compressor"
  | "image-resizer"
  | "image-watermark"
  | "background-remover"
  | "qr-generator"
  | "content-counter"

interface ToolSeoConfig {
  slug: ToolSlug
  path: string
  title: string
  description: string
  keywords: string[]
}

export const TOOL_SEO_CONFIG: Record<ToolSlug, ToolSeoConfig> = {
  "image-converter": {
    slug: "image-converter",
    path: "/tools/image-converter",
    title: "Free Online Image Converter (PNG, JPG, WebP) | ToolKitSol",
    description:
      "Convert images between PNG, JPG, and WebP formats without losing visible quality. Batch convert photos online for free with ToolKitSol.",
    keywords: [
      "online image converter",
      "png to jpg converter",
      "jpg to webp converter",
      "webp to png",
      "convert images online",
      "free image format converter",
    ],
  },
  "image-compressor": {
    slug: "image-compressor",
    path: "/tools/image-compressor",
    title: "Image Compressor – Reduce Image Size Without Losing Quality | ToolKitSol",
    description:
      "Compress JPG and PNG images online while preserving clarity. Reduce image file size for web, email, and social media without visible quality loss.",
    keywords: [
      "image compressor online",
      "compress jpg",
      "compress png",
      "reduce image size",
      "optimize images for web",
      "compress image without losing quality",
    ],
  },
  "image-resizer": {
    slug: "image-resizer",
    path: "/tools/image-resizer",
    title: "Image Resizer – Resize Images to Exact Dimensions | ToolKitSol",
    description:
      "Resize images to custom width and height in pixels while keeping aspect ratio. Perfect for thumbnails, social media, and web graphics.",
    keywords: [
      "image resizer online",
      "resize image dimensions",
      "change image size in pixels",
      "resize photo for web",
      "online picture resizer",
    ],
  },
  "image-watermark": {
    slug: "image-watermark",
    path: "/tools/image-watermark",
    title: "Add Watermark to Images – Text & Logo Overlay | ToolKitSol",
    description:
      "Protect your photos by adding text or logo watermarks online. Control watermark size, position, and opacity directly in your browser.",
    keywords: [
      "add watermark to image",
      "image watermark online",
      "add logo to photo",
      "protect images with watermark",
      "text watermark generator",
    ],
  },
  "background-remover": {
    slug: "background-remover",
    path: "/tools/background-remover",
    title: "Background Remover – Remove Image Background Online | ToolKitSol",
    description:
      "Remove image backgrounds automatically and export transparent PNGs. Perfect for product photos, profile pictures, and social media graphics.",
    keywords: [
      "remove background from image",
      "background remover online",
      "make background transparent",
      "remove background png",
      "background eraser tool",
    ],
  },
  "qr-generator": {
    slug: "qr-generator",
    path: "/tools/qr-generator",
    title: "Free QR Code Generator – Create Custom QR Codes Online | ToolKitSol",
    description:
      "Generate high-quality QR codes for URLs, text, Wi‑Fi, and more. Download QR codes as PNG for printing or sharing online.",
    keywords: [
      "free qr code generator",
      "create qr code online",
      "qr code for url",
      "download qr code png",
      "custom qr code generator",
    ],
  },
  "content-counter": {
    slug: "content-counter",
    path: "/tools/content-counter",
    title: "Word & Character Counter – Analyze Your Content | ToolKitSol",
    description:
      "Count words, characters, sentences, and paragraphs instantly. Check content length for SEO, social media, and writing platforms.",
    keywords: [
      "word counter online",
      "character counter",
      "text length checker",
      "content analyzer",
      "seo content word count",
    ],
  },
}

export const getToolSeo = (slug: ToolSlug): ToolSeoConfig => {
  return TOOL_SEO_CONFIG[slug]
}

export const buildWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ToolKitSol",
  url: BASE_URL,
  description:
    "ToolKitSol offers free online tools including image converters, compressors, resizers, background removers, QR code generator and content counter.",
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
})

export const buildToolJsonLd = (slug: ToolSlug) => {
  const tool = getToolSeo(slug)

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title.replace(" | ToolKitSol", ""),
    url: `${BASE_URL}${tool.path}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    description: tool.description,
    inLanguage: "en",
  }
}

type BlogPostForSeo = {
  slug: string
  title: string
  excerpt?: string
  date?: string
  author?: string
  coverImage?: string
}

export const buildBlogPostingJsonLd = (post: BlogPostForSeo) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.excerpt ?? "",
  url: `${BASE_URL}/blog/${post.slug}`,
  datePublished: post.date ?? undefined,
  dateModified: post.date ?? undefined,
  author: post.author
    ? {
        "@type": "Person",
        name: post.author,
      }
    : {
        "@type": "Organization",
        name: "ToolKitSol",
      },
  publisher: {
    "@type": "Organization",
    name: "ToolKitSol",
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
    },
  },
  image: post.coverImage ? [`${BASE_URL}${post.coverImage}`] : undefined,
})

