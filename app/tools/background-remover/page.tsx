"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Loader2, Download, ImageIcon, Sparkles, ArrowRight, Plus } from "lucide-react"
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
  const [showComparison, setShowComparison] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

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
          setShowComparison(true)
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

  // 🆕 New Image
  const handleNewImage = () => {
    setImage(null)
    setShowComparison(false)
    setIsComplete(false)
    setProgress(0)
    setIsUploading(false)
    setIsProcessing(false)
  }

  // 🖱️ Drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  // Check if we should show the main upload page
  const showMainPage = !showComparison && !isUploading && !isProcessing

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Full Page Drop Area - Only shown when no processing/comparison */}
      <AnimatePresence>
        {showMainPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`min-h-screen flex flex-col ${
              isDragOver 
                ? "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50" 
                : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="max-w-7xl mx-auto px-6 py-8 w-full">
                <div className="text-center">
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
                      {" "}
                      Instantly
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
              </div>

              {/* Main Drop Area - Takes remaining space */}
              <div className="flex-1 flex items-center justify-center px-6 pb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-4xl"
                >
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
                    <div className="text-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleInputChange} 
                        className="hidden" 
                        id="file-upload" 
                      />
                      <label 
                        htmlFor="file-upload" 
                        className="cursor-pointer flex flex-col items-center gap-8"
                      >
                        <motion.div
                          className={`w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl ${
                            isDragOver ? "scale-110 rotate-12" : ""
                          } transition-all duration-300`}
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Upload className="w-16 h-16 text-white" />
                        </motion.div>
                        
                        <div className="space-y-4">
                          <motion.p 
                            className="text-3xl font-bold text-slate-800"
                            whileHover={{ scale: 1.02 }}
                          >
                            Drop your image here or click to browse
                          </motion.p>
                          <p className="text-lg text-slate-600">
                            Supports PNG, JPG, WebP • Max 10MB
                          </p>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 text-xl">
                            Choose File
                          </Button>
                        </motion.div>
                      </label>
                    </div>

                    {/* Drag Overlay */}
                    <AnimatePresence>
                      {isDragOver && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl border-4 border-dashed border-purple-400 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <Upload className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                            <p className="text-2xl font-bold text-purple-700">Drop to upload</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Features & More Tools */}
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
                  {/* Features */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">✨ Features</h3>
                      <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>AI-powered precision
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>Instant processing
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>High-quality results
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>Multiple formats
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl">
                      <h3 className="text-lg font-semibold mb-2">💡 Pro Tip</h3>
                      <p className="text-sm text-purple-100">
                        For best results, use images with clear subject-background contrast and good lighting.
                      </p>
                    </div>
                  </div>

                  {/* More Tools */}
                  <div className="lg:col-span-2">
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Explore More Tools</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          {
                            title: "Image Converter",
                            description: "Convert between formats",
                            href: "/tools/image-converter",
                            gradient: "from-blue-500 to-cyan-500",
                            icon: "🔄",
                          },
                          {
                            title: "QR Generator",
                            description: "Create custom QR codes",
                            href: "/tools/qr-generator",
                            gradient: "from-purple-500 to-pink-500",
                            icon: "📱",
                          },
                        ].map((tool, index) => (
                          <Link key={tool.href} href={tool.href}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group cursor-pointer"
                            >
                              <div
                                className={`w-10 h-10 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-300`}
                              >
                                {tool.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {tool.title}
                                </h4>
                                <p className="text-sm text-slate-600">{tool.description}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing State - Full screen loading */}
      <AnimatePresence>
        {(isUploading || isProcessing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center z-50"
          >
            <div className="text-center max-w-2xl mx-auto px-6">
              {/* Circular Spinner with Glow */}
              <div className="flex flex-col items-center justify-center space-y-8 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-purple-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-24 h-24 border-4 border-purple-500 rounded-full animate-spin border-t-transparent shadow-2xl shadow-purple-500/30"></div>
                  <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent rounded-full animate-ping border-t-purple-400"></div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                    {isUploading ? "Uploading Image..." : "Removing Background..."}
                  </p>
                  <p className="text-xl text-slate-600">
                    {isUploading ? "Preparing your image..." : "AI is working its magic"}
                  </p>
                </div>
              </div>
              
              <Progress value={progress} className="h-3 rounded-full max-w-md mx-auto" />
              <p className="text-lg text-slate-600 mt-4">{progress}% complete</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Section - Only shown after processing */}
      <AnimatePresence>
        {showComparison && image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-1">
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 sticky top-8">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-3 h-3 text-white" />
                      </div>
                      Upload New Image
                    </h2>

                    <motion.div
                      className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-gradient-to-br from-slate-50/50 to-blue-50/50 hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => document.getElementById('file-upload-2')?.click()}
                    >
                      <input type="file" accept="image/*" onChange={handleInputChange} className="hidden" id="file-upload-2" />
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-slate-700 mb-1">Upload new image</p>
                          <p className="text-sm text-slate-500">PNG, JPG, WebP</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Features Sidebar */}
                    <div className="mt-6 space-y-4">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
                        <h3 className="text-sm font-semibold mb-1">💡 Pro Tip</h3>
                        <p className="text-xs text-purple-100">
                          Clear contrast & good lighting for best results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Section */}
                <div className="lg:col-span-3">
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-8 text-center">Before & After Comparison</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Original */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-slate-700">Original Image</h3>
                          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Before</span>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white">
                          <img
                            src={image.original || "/placeholder.svg"}
                            alt="Original"
                            className="w-full h-auto object-cover"
                          />
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
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                              <div className="relative">
                                <div className="w-16 h-16 border-4 border-purple-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 rounded-full animate-spin border-t-transparent shadow-lg shadow-purple-500/30"></div>
                              </div>
                              <p className="text-slate-700 font-medium">Processing...</p>
                            </div>
                          ) : image.processed ? (
                            <div className="relative group">
                              <img
                                src={image.processed || "/placeholder.svg"}
                                alt="Processed"
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-64">
                              <p className="text-slate-500">Processing failed</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {isComplete && image?.processed && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center"
                      >
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-green-700 font-medium">Background removed successfully!</span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                              onClick={handleNewImage}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                              <Plus className="w-5 h-5" />
                              New Image
                            </Button>
                            <Button
                              onClick={handleDownload}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                            >
                              <Download className="w-5 h-5" />
                              Download Processed Image
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}