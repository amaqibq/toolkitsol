"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Upload, Loader2, Download, ImageIcon, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface ProcessedImage {
  original: string
  processed: string
  fileName: string
}

export default function BackgroundRemover() {
  const [image, setImage] = useState<ProcessedImage | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // 🔥 API Call
  const processImage = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/remove-bg`, {
      method: "POST",
        headers: {
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY as string,
  },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to process image")
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  }, [])

  // 📂 File Upload
  const handleFileSelect = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return
      const file = files[0]
      if (!file.type.startsWith("image/")) return

      setIsUploading(true)
      setProgress(20)

      const reader = new FileReader()
      reader.onload = async () => {
        const originalData = reader.result as string
        setImage({
          original: originalData,
          processed: "",
          fileName: file.name,
        })

        setIsUploading(false)
        setIsProcessing(true)
        setProgress(50)

        try {
          const processedUrl = await processImage(file)
          setImage((prev) => (prev ? { ...prev, processed: processedUrl } : null))
          setIsComplete(true)
        } catch (err) {
          console.error("Error while processing:", err)
        }

        setIsProcessing(false)
        setProgress(100)
      }
      reader.readAsDataURL(file)
    },
    [processImage],
  )

  // 📥 File input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(Array.from(e.target.files))
    }
  }

  // 💾 Download processed
  const handleDownload = () => {
    if (!image?.processed) return
    const a = document.createElement("a")
    a.href = image.processed
    a.download = `${image.fileName.replace(/\.[^/.]+$/, "")}-no-bg.png`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Background Removal
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance"
          >
            Remove Backgrounds
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "} Instantly
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Upload any image and get a professional background removal in seconds. Perfect for product photos,
            portraits, and creative projects.
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white" />
                </div>
                Upload Your Image
              </h2>

              <motion.div
                className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-gradient-to-br from-slate-50/50 to-blue-50/50 hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input type="file" accept="image/*" onChange={handleInputChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-700 mb-2">Drop your image here or click to browse</p>
                    <p className="text-sm text-slate-500">Supports PNG, JPG, WebP • Max 10MB</p>
                  </div>
                </label>
              </motion.div>

              {(isUploading || isProcessing) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="font-medium text-slate-700">
                      {isUploading ? "Uploading image..." : isProcessing ? "Removing background..." : ""}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-slate-600 mt-2">{progress}% complete</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Features Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">✨ Features</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div>AI-powered precision</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div>Instant processing</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div>High-quality results</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-pink-500 rounded-full"></div>Multiple formats</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-semibold mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-purple-100">
                For best results, use images with clear subject-background contrast and good lighting.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Before & After */}
        {image && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">Before & After Comparison</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Original */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-slate-700">Original Image</h3>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Before</span>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <img src={image.original || "/placeholder.svg"} alt="Original" className="w-full h-auto object-cover" />
                  </div>
                </div>

                {/* Processed */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-slate-700">Background Removed</h3>
                    <span className="text-sm text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">After</span>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-slate-100 to-slate-200">
                    {isProcessing ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-12 h-12 animate-spin text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Processing your image...</p>
                      </div>
                    ) : image.processed ? (
                      <img src={image.processed || "/placeholder.svg"} alt="Processed" className="w-full h-auto object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-slate-500">Processing failed. Please try again.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isComplete && image?.processed && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-green-700 font-medium">Background removed successfully!</span>
                    </div>
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Processed Image
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* More Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
                title: "QR Generator",
                description: "Create custom QR codes instantly",
                href: "/tools/qr-generator",
                gradient: "from-purple-500 to-pink-500",
                icon: "📱",
              },
              {
                title: "Content Counter",
                description: "Analyze text length and readability",
                href: "/tools/content-counter",
                gradient: "from-green-500 to-teal-500",
                icon: "📝",
              },
            ].map((tool, index) => (
              <Link key={tool.href} href={tool.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
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