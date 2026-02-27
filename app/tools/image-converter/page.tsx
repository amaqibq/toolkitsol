import type { Metadata } from "next"
import { getToolSeo } from "@/lib/seo"
import ImageConverterPage from "@/components/tools/image-converter/ImageConverterPage"

export const metadata: Metadata = (() => {
  const seo = getToolSeo("image-converter")
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.path,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.path,
      type: "website",
      siteName: "ToolKitSol",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  }
})()

export default function Page() {
  return <ImageConverterPage />
}