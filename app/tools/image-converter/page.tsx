"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, ImageIcon, CheckCircle, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

declare global {
  interface Window {
    JSZip: any
  }
}

interface ImageFile {
  file: File
  preview: string
  name: string
  size: string
  originalFormat: string
}

interface ConversionOptions {
  format: string
  quality: number
  backgroundColor?: string
}

export default function ImageConverterPage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [conversionOptions, setConversionOptions] = useState<ConversionOptions>({
    format: "png",
    quality: 90,
    backgroundColor: "#ffffff",
  })
  const [isComplete, setIsComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadJSZip = async () => {
    if (typeof window !== "undefined" && !window.JSZip) {
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
      document.head.appendChild(script)

      return new Promise((resolve) => {
        script.onload = () => resolve(window.JSZip)
      })
    }
    return window.JSZip
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileFormat = (fileName: string): string => {
    return fileName.split(".").pop()?.toLowerCase() || "unknown"
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true)
    const imageFiles: ImageFile[] = []

    acceptedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = () => {
          imageFiles.push({
            file,
            preview: reader.result as string,
            name: file.name,
            size: formatFileSize(file.size),
            originalFormat: getFileFormat(file.name),
          })

          if (imageFiles.length === acceptedFiles.length) {
            setImages(imageFiles)
            setIsUploading(false)
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    onDrop(files)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    onDrop(files)
  }

  const convertImage = async (imageFile: ImageFile): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        // Fill background if converting to JPG or if background color is specified
        if (conversionOptions.format === "jpeg" || conversionOptions.backgroundColor) {
          ctx.fillStyle = conversionOptions.backgroundColor || "#ffffff"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        ctx.drawImage(img, 0, 0)

        canvas.toBlob(
          (blob) => {
            resolve(blob!)
          },
          `image/${conversionOptions.format}`,
          conversionOptions.quality / 100,
        )
      }

      img.src = imageFile.preview
    })
  }

  const handleConvert = async () => {
    setIsConverting(true)
    setProgress(0)

    const convertedImages: { blob: Blob; filename: string }[] = []

    // Convert all images
    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i]
      const convertedBlob = await convertImage(imageFile)
      const filename = `${imageFile.name.split(".")[0]}.${conversionOptions.format}`

      convertedImages.push({ blob: convertedBlob, filename })

      // Update progress
      setProgress(((i + 1) / images.length) * 100)
    }

    // Handle download based on number of images
    if (convertedImages.length === 1) {
      // Single image: Direct download
      const { blob, filename } = convertedImages[0]
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      // Multiple images: ZIP download
      await loadJSZip()
      const zip = new window.JSZip()

      // Add all converted images to ZIP
      convertedImages.forEach(({ blob, filename }) => {
        zip.file(filename, blob)
      })

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" })

      // Download ZIP file with website name prefix
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `toolkitsol.com_images.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    setIsConverting(false)
    setIsComplete(true)
  }

  const resetConverter = () => {
    setImages([])
    setIsComplete(false)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (indexToRemove: number) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setImages(images.filter((_, index) => index !== indexToRemove))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              ToolkitSol
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/qr-generator" className="text-slate-600 hover:text-blue-600 transition-colors">
                QR Generator
              </Link>
              <Link href="/content-counter" className="text-slate-600 hover:text-blue-600 transition-colors">
                Content Counter
              </Link>
              <Link href="/background-remover" className="text-slate-600 hover:text-blue-600 transition-colors">
                Background Remover
              </Link>
            </nav>
          </div>
        </div>
      </header> */}

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            High-Quality Image Conversion
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance"
          >
            Convert Images
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Instantly</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Convert your images between PNG, JPG, WebP and other formats with optional background color changes and
            quality control.
          </motion.p>
        </div>

        <div className="space-y-8">
          {images.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                  Upload Your Images
                </h2>

                <motion.div
                  className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-gradient-to-br from-slate-50/50 to-blue-50/50 hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-700 mb-2">
                        Drop your images here or click to browse
                      </p>
                      <p className="text-sm text-slate-500">Supports PNG, JPG, WebP • Max 10MB per file</p>
                    </div>
                  </div>
                </motion.div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </motion.div>
          )}

          {images.length > 0 && !isComplete && (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
              >
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">⚙️</span>
                  </div>
                  Conversion Options
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-slate-800">Output Format</Label>
                    <Select
                      value={conversionOptions.format}
                      onValueChange={(value) => setConversionOptions({ ...conversionOptions, format: value })}
                    >
                      <SelectTrigger className="h-12 border-2 border-slate-200 focus:border-blue-500 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200 shadow-xl rounded-xl">
                        <SelectItem value="png" className="font-semibold hover:bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>PNG</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="jpeg" className="font-semibold hover:bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>JPG</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="webp" className="font-semibold hover:bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span>WebP</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                      <p className="text-sm font-bold text-blue-800">
                        Selected: {conversionOptions.format.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-bold text-slate-800">Quality ({conversionOptions.quality}%)</Label>
                    <Input
                      type="range"
                      min="10"
                      max="100"
                      value={conversionOptions.quality}
                      onChange={(e) =>
                        setConversionOptions({ ...conversionOptions, quality: Number.parseInt(e.target.value) })
                      }
                      className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-bold text-slate-800">Background Color</Label>
                    <Input
                      type="color"
                      value={conversionOptions.backgroundColor}
                      onChange={(e) => setConversionOptions({ ...conversionOptions, backgroundColor: e.target.value })}
                      className="w-full h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    {isConverting ? "Converting..." : "Start Conversion"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetConverter}
                    className="px-8 py-3 rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 bg-transparent"
                  >
                    Reset
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
              >
                <h2 className="text-2xl font-semibold text-slate-900 mb-6">Uploaded Images ({images.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group border border-slate-200 rounded-xl p-3 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="relative">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-20 object-cover rounded-lg mb-2"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 truncate">{image.name}</p>
                      <p className="text-xs text-slate-500">
                        {image.originalFormat.toUpperCase()} • {image.size}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {isConverting && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <span className="font-medium text-slate-700">Converting images...</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-slate-600 mt-2">{Math.round(progress)}% complete</p>
                </motion.div>
              )}
            </div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-green-700">Conversion Complete!</h3>
                  <p className="text-sm text-green-600">Your images have been converted and downloaded successfully.</p>
                </div>
              </div>
              <Button
                onClick={resetConverter}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Convert More Images
              </Button>
            </motion.div>
          )}

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
                  title: "Background Remover",
                  description: "Remove backgrounds from images instantly",
                  href: "/tools/background-remover",
                  gradient: "from-purple-500 to-pink-500",
                  icon: "✂️",
                },
                {
                  title: "QR Generator",
                  description: "Create custom QR codes instantly",
                  href: "/tools/qr-generator",
                  gradient: "from-blue-500 to-cyan-500",
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
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${tool.gradient} rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {tool.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{tool.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
