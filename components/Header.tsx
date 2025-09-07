"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          ToolkitSol
        </Link>

        {/* Desktop Nav (only lg and up) */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link href="/tools/image-converter" className="text-slate-600 hover:text-blue-600 transition-colors">
            Image Converter
          </Link>
          <Link href="/tools/qr-generator" className="text-slate-600 hover:text-blue-600 transition-colors">
            QR Generator
          </Link>
          <Link href="/tools/content-counter" className="text-slate-600 hover:text-blue-600 transition-colors">
            Content Counter
          </Link>
          <Link href="/tools/background-remover" className="text-slate-600 hover:text-blue-600 transition-colors">
            Background Remover
          </Link>
        </nav>

        {/* Mobile & Tablet Menu Button */}
        <button
          className="lg:hidden p-2 rounded-md text-slate-600 hover:text-blue-600 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile & Tablet Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
          <nav className="flex flex-col p-4 space-y-3">
            <Link
              href="/tools/image-converter"
              className="text-slate-600 hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Image Converter
            </Link>
            <Link
              href="/tools/qr-generator"
              className="text-slate-600 hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              QR Generator
            </Link>
            <Link
              href="/tools/content-counter"
              className="text-slate-600 hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Content Counter
            </Link>
            <Link
              href="/tools/background-remover"
              className="text-slate-600 hover:text-blue-600 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Background Remover
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
