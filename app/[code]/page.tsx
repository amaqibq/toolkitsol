"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

const STORAGE_KEY = "toolkitsol_short_links"

function getStoredMap(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

export default function ShortRedirectPage() {
  const params = useParams()
  const code = typeof params?.code === "string" ? params.code : null
  const [status, setStatus] = useState<"loading" | "redirect" | "not-found">("loading")

  useEffect(() => {
    if (!code) {
      setStatus("not-found")
      return
    }
    const map = getStoredMap()
    const target = map[code]
    if (target) {
      setStatus("redirect")
      window.location.href = target
      return
    }
    setStatus("not-found")
  }, [code])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex items-center justify-center px-6">
        <div className="w-10 h-10 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (status === "not-found") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Short link not found</h1>
          <p className="text-slate-600 text-sm mb-6">
            This link may have expired or was created on another device. Short links are stored in your browser.
          </p>
          <Link href="/tools/free-url-shortener">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl">
              Create a short link
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex items-center justify-center px-6">
      <div className="w-10 h-10 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
    </div>
  )
}
