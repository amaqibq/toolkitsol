import type React from "react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Script from "next/script"
import { buildWebsiteJsonLd } from "@/lib/seo"

const BASE_URL = "https://www.toolkitsol.com"

/** Base metadata for all pages. Child segments (e.g. blog) merge and override as needed. */
const baseMetadata: Metadata = {
  title: "Free Image Converter, Compressor & QR Code Generator | ToolKitSol",
  description:
    "ToolKitSol offers free online tools including PNG to JPG converter, JPG to WEBP converter, image compressor, image resizer, background remover, QR code generator and word counter. 100% free and unlimited tools with no signup required.",
  keywords: [
    "free image converter",
    "png to jpg converter",
    "jpg to webp converter",
    "image compressor online",
    "reduce image size",
    "image resizer online",
    "background remover online free",
    "free qr code generator",
    "word counter online",
    "online image tools",
    "free web tools",
    "convert png to jpg",
    "compress image without losing quality",
  ],
  metadataBase: new URL(BASE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "ToolKitSol Team" }],
  creator: "ToolKitSol",
  publisher: "ToolKitSol",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Free Image Converter & Compressor Online | ToolKitSol",
    description:
      "Convert PNG to JPG, compress images, resize photos, remove backgrounds, generate QR codes and count words online for free. Unlimited usage with fast and secure processing.",
    url: BASE_URL,
    siteName: "ToolKitSol",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "ToolKitSol - Free Online Image & Web Tools",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image Converter & Online Tools | ToolKitSol",
    description:
      "PNG to JPG converter, image compressor, background remover, QR code generator & more. 100% free and unlimited online tools.",
    images: ["/logo.png"],
  },
}

/**
 * Central SEO: dynamic canonical from current pathname (set by middleware).
 * Blog and other segments override via their own generateMetadata; no duplicate tags.
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? "/"
  const canonical = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname
  return {
    ...baseMetadata,
    alternates: {
      canonical,
    },
  }
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="doh3DSYrCAl5ptOMmz2iAazRLaztjFHU3KiEF30sITg"
        />

        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>

        {/* ✅ Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HPE465JWH6"
        />
        <Script id="ga-setup" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HPE465JWH6');`}
        </Script>

        {/* ✅ Structured Data: Website */}
        <script
          type="application/ld+json"
          // JSON-LD must be a string literal in the DOM
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebsiteJsonLd()) }}
        />
      </head>

      <body className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
