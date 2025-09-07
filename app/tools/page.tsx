"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ImageIcon,
  QrCode,
  FileText,
  Scissors,
} from "lucide-react"

const tools = [
  {
    title: "Image Converter",
    description: "Easily convert images between PNG, JPG, and WebP formats.",
    href: "/tools/image-converter",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-100 via-cyan-100 to-blue-50",
    icon: ImageIcon,
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
]

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Tools Section */}
      <section id="tools" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance">
              Powerful Tools at Your Fingertips
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
              Choose from our collection of essential tools designed to streamline your workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2 rounded-3xl border border-white/20">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-50`}
                  />

                  <CardHeader className="relative pb-4 pt-8">
                    <div className="flex items-start space-x-4 mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${tool.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}
                      >
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-slate-900 group-hover:text-slate-800 transition-colors duration-300 font-semibold">
                          {tool.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-slate-600 leading-relaxed text-sm">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative pt-0 pb-8">
                    <Link href={tool.href}>
                      <Button
                        className={`w-full bg-gradient-to-r ${tool.gradient} hover:shadow-lg text-white border-0 transition-all duration-300 font-medium rounded-xl group-hover:scale-105`}
                      >
                        Use Tool
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                          →
                        </span>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
