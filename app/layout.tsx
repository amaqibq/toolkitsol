import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

// ✅ import Header & Footer
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "ToolKit - Essential Tools for Digital Creators",
  description:
    "Convert images, generate QR codes, count content, and remove backgrounds with our powerful suite of digital tools.",
  generator: "v0.app",
  keywords: "image converter, QR code generator, content counter, background remover, digital tools",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        {/* ✅ google analytic code */}
       
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HPE465JWH6"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-HPE465JWH6');
</script>
      </head>
      <body className="flex flex-col min-h-screen">
        {/* ✅ Global Header */}
        <Header />

        {/* ✅ Page Content */}
        <main className="flex-1">{children}</main>


        {/* ✅ Global Footer */}
        <Footer />
      </body>
    </html>
  )
}