"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link2, Copy, CheckCircle, Sparkles, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { buildToolJsonLd } from "@/lib/seo"

const STORAGE_KEY = "toolkitsol_short_links"

function isValidUrl(input: string): boolean {
  const trimmed = input.trim()
  if (!trimmed) return false
  try {
    const url = new URL(trimmed)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function generateShortCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const length = 6 + Math.floor(3 * Math.random()) // 6, 7, or 8
  const bytes = new Uint8Array(length)
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  let code = ""
  for (let i = 0; i < length; i++) code += chars[bytes[i]! % chars.length]
  return code
}

function getStoredMap(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

function setStoredMap(map: Record<string, string>) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export default function FreeUrlShortenerPage() {
  const searchParams = useSearchParams()
  const codeParam = searchParams.get("code")

  const [longUrl, setLongUrl] = useState("")
  const [shortCode, setShortCode] = useState<string | null>(null)
  const [shortLink, setShortLink] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const handleRedirect = useCallback(() => {
    if (!codeParam) return
    setRedirecting(true)
    const map = getStoredMap()
    const target = map[codeParam]
    if (target) {
      window.location.href = target
      return
    }
    setNotFound(true)
    setRedirecting(false)
  }, [codeParam])

  useEffect(() => {
    if (codeParam) {
      handleRedirect()
    }
  }, [codeParam, handleRedirect])

  const handleShorten = () => {
    setError(null)
    setShortCode(null)
    setShortLink("")
    const trimmed = longUrl.trim()
    if (!trimmed) {
      setError("Please enter a URL.")
      return
    }
    if (!isValidUrl(trimmed)) {
      setError("Please enter a valid URL (e.g. https://example.com).")
      return
    }
    const map = getStoredMap()
    let code = generateShortCode()
    while (map[code]) code = generateShortCode()
    map[code] = trimmed
    setStoredMap(map)
    setShortCode(code)
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    setShortLink(`${origin}/${code}`)
  }

  const handleCopy = async () => {
    if (!shortLink) return
    try {
      await navigator.clipboard.writeText(shortLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Could not copy to clipboard.")
    }
  }

  if (codeParam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex items-center justify-center px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...buildToolJsonLd("free-url-shortener"),
              "@type": "SoftwareApplication",
            }),
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
            <CardContent className="pt-8 pb-8">
              {redirecting && !notFound && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
                  <p className="text-slate-700 font-medium">Redirecting...</p>
                </div>
              )}
              {notFound && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Short link not found</h2>
                  <p className="text-slate-600 text-center text-sm">
                    This short link may have expired or was created on another device. Short links are stored locally in your browser.
                  </p>
                  <Link href="/tools/free-url-shortener">
                    <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl">
                      Create a short link
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...buildToolJsonLd("free-url-shortener"),
            "@type": "SoftwareApplication",
          }),
        }}
      />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Create Short Links Instantly
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance"
          >
            Free URL Shortener
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {" "}
              Tool
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Paste a long URL and get a short link. No signup required. Links are stored in your browser for instant redirects.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-white" />
                  </div>
                  Enter Long URL
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Paste the URL you want to shorten (must start with http:// or https://)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="long-url" className="text-base font-medium text-slate-800">
                    URL
                  </Label>
                  <Input
                    id="long-url"
                    type="url"
                    placeholder="https://example.com/very/long/url"
                    value={longUrl}
                    onChange={(e) => {
                      setLongUrl(e.target.value)
                      setError(null)
                    }}
                    className="border-2 border-slate-200 focus:border-amber-500 rounded-xl h-12"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </p>
                )}
                <Button
                  onClick={handleShorten}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Shorten URL
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-slate-900">Your short link</CardTitle>
                <CardDescription className="text-slate-600">
                  {shortCode ? "Copy and share this link" : "Shorten a URL to see your link here"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {shortCode ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 break-all">
                      <span className="text-slate-800 font-medium text-sm">{shortLink}</span>
                    </div>
                    <Button
                      onClick={handleCopy}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied to clipboard
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy link
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-slate-500">
                      Stored in this browser. Opening the short link on this device will redirect to the original URL.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                      <Link2 className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500">Your short link will appear here after you shorten a URL.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Explore More Tools</h2>
            <p className="text-slate-600">Discover other powerful utilities to enhance your workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Image Converter",
                description: "Convert between PNG, JPG, WebP formats",
                href: "/tools/image-converter",
                gradient: "from-blue-500 to-cyan-500",
                icon: "🔄",
              },
              {
                title: "Content Counter",
                description: "Analyze text length and readability",
                href: "/tools/content-counter",
                gradient: "from-green-500 to-teal-500",
                icon: "📝",
              },
              {
                title: "QR Generator",
                description: "Create custom QR codes instantly",
                href: "/tools/qr-generator",
                gradient: "from-purple-500 to-pink-500",
                icon: "📱",
              },
            ].map((tool, index) => (
              <Link key={tool.href} href={tool.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">{tool.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all duration-300">
                    Try it now
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
