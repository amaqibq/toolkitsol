import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Script from "next/script"

export const metadata: Metadata = {
  title: "ToolKit - Essential Tools for Digital Creators",
  description:
    "Convert images, generate QR codes, count content, and remove backgrounds with our powerful suite of digital tools.",
  generator: "v0.app",
  keywords:
    "image converter, QR code generator, content counter, background remover, digital tools",
  metadataBase: new URL("https://www.toolkitsol.com"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "ToolKit - Essential Tools for Digital Creators",
    description:
      "Convert images, generate QR codes, count content, and remove backgrounds easily with ToolKit’s all-in-one suite.",
    url: "https://www.toolkitsol.com",
    siteName: "ToolKitSol",
    images: [
      {
        url: "/logo.png", // ✅ your logo file from /public
        width: 800,
        height: 600,
        alt: "ToolKitSol Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolKit - Essential Tools for Digital Creators",
    description:
      "Your go-to digital toolkit for quick conversions, QR generation, and more.",
    images: ["/logo.png"], // ✅ uses same logo
  },
};


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
      </head>

      <body className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  )
}
