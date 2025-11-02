"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, QrCode, FileText, Scissors, Zap, Maximize2, Droplet } from "lucide-react"

const tools = [
  {
    title: "Image Converter",
    description: "Easily convert images between PNG, JPG, and WebP formats.",
    href: "/tools/image-converter",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-100 via-cyan-100 to-blue-50",
    icon: ImageIcon,
    badge: "Popular",
  },
  {
    title: "QR Generator",
    description: "Generate custom QR codes for links, text, and more instantly.",
    href: "/tools/qr-generator",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-100 via-pink-100 to-pink-50",
    icon: QrCode,
  },
  {
    title: "Content Counter",
    description: "Analyze text length, word count, and readability score.",
    href: "/tools/content-counter",
    gradient: "from-green-500 to-teal-500",
    bgGradient: "from-green-100 via-teal-100 to-green-50",
    icon: FileText,
  },
  {
    title: "Background Remover",
    description: "Remove image backgrounds instantly with AI-powered precision.",
    href: "/tools/background-remover",
    gradient: "from-indigo-500 to-violet-500",
    bgGradient: "from-indigo-100 via-violet-100 to-indigo-50",
    icon: Scissors,
  },
  {
    title: "Image Compressor",
    description: "Reduce file sizes while maintaining quality for web optimization.",
    href: "/tools/image-compressor",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-100 via-red-100 to-orange-50",
    icon: Zap,
    badge: "Fast",
  },
  {
    title: "Image Resizer",
    description: "Resize images to any dimensions with smart aspect ratio control.",
    href: "/tools/image-resizer",
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-100 via-blue-100 to-cyan-50",
    icon: Maximize2,
  },
  {
    title: "Image Watermark",
    description: "Add custom text watermarks with full control and positioning.",
    href: "/tools/image-watermark",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-100 via-rose-100 to-pink-50",
    icon: Droplet,
    badge: "New",
  },
]

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Tools Section */}
      <section id="tools" className="py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-balance">Powerful Image Tools</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto text-pretty">
              Everything you need to transform, optimize, and enhance your images. Seven professional-grade tools in one
              place.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <Link href={tool.href}>
                  <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-md hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-500 rounded-2xl border border-white/40 h-full flex flex-col cursor-pointer">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
                    />

                    {/* Badge */}
                    {tool.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 shadow-md">
                          {tool.badge}
                        </span>
                      </div>
                    )}

                    <CardHeader className="relative pb-4 pt-8 flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${tool.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 flex-shrink-0`}
                        >
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg text-slate-900 group-hover:text-slate-800 transition-colors duration-300 font-semibold">
                            {tool.title}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-slate-600 leading-relaxed text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="relative pt-0 pb-6">
                      <Button
                        className={`w-full bg-gradient-to-r ${tool.gradient} hover:shadow-lg text-white border-0 transition-all duration-300 font-medium rounded-xl group-hover:scale-105 transform`}
                      >
                        Use Tool
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
