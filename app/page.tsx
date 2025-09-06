"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, QrCodeIcon, FileTextIcon, ScissorsIcon, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function HomePage() {
  const tools = [
    {
      title: "Image Converter",
      description: "Convert images between PNG, JPG, WebP and other formats with optional background color changes",
      icon: ImageIcon,
      href: "/image-converter",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50/50 to-cyan-50/50",
    },
    {
      title: "QR Code Generator",
      description: "Generate QR codes instantly from text or links with download options",
      icon: QrCodeIcon,
      href: "/qr-generator",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50/50 to-pink-50/50",
    },
    {
      title: "Content Counter",
      description: "Count words and characters in your text with future AI rewriting capabilities",
      icon: FileTextIcon,
      href: "/content-counter",
      gradient: "from-green-500 to-teal-500",
      bgGradient: "from-green-50/50 to-teal-50/50",
    },
    {
      title: "Background Remover",
      description: "Remove backgrounds from images automatically with format conversion options",
      icon: ScissorsIcon,
      href: "/background-remover",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50/50 to-pink-50/50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ToolkitSol
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#tools"
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Tools
              </Link>
              <Link
                href="#about"
                className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                About
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 bg-transparent"
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <section className="py-24 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Tools Suite
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight text-balance"
          >
            Essential Tools for
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
              Digital Creators
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Convert images, generate QR codes, count content, and remove backgrounds - all in one powerful,
            user-friendly platform designed for efficiency and simplicity.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Explore Tools
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 bg-transparent"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

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
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-50`} />

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
                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 border-t border-slate-700 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <h3 className="text-xl font-bold text-white">ToolKit</h3>
              </div>
              <p className="text-slate-300 mb-4 max-w-md leading-relaxed">
                Essential tools for digital creators. Convert, generate, count, and edit with ease.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Tools</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/image-converter"
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    Image Converter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/qr-generator"
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    QR Generator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content-counter"
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    Content Counter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/background-remover"
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                  >
                    Background Remover
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#about" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#privacy" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400">© 2024 ToolKit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
