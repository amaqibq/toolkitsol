"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, ImageIcon, CheckCircle, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { buildToolJsonLd } from "@/lib/seo"

interface ImageFile {
  file: File
  preview: string
  name: string
  size: string
}

interface WatermarkOptions {
  text: string
  fontSize: number
  opacity: number
  position: "top-left" | "top-center" | "top-right" | "center" | "bottom-left" | "bottom-center" | "bottom-right"
  color: string
}

export default function ImageWatermarkPage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isApplying, setIsApplying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [watermarkOptions, setWatermarkOptions] = useState<WatermarkOptions>({
    text: "© 2025",
    fontSize: 40,
    opacity: 0.7,
    position: "bottom-right",
    color: "#ffffff",
  })
  const [isComplete, setIsComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }

  const handleFileSelect = (files: File[] | React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.isArray(files) ? files : files.target.files
    if (!selectedFiles || selectedFiles.length === 0) return
    const newImages: ImageFile[] = []

    for (const file of selectedFiles) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        newImages.push({
          file,
          preview,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        })
        setImages((prevImages) => [...prevImages, ...newImages])
      }
      reader.readAsDataURL(file)
    }
  }

  const getPositionCoordinates = (
    canvasWidth: number,
    canvasHeight: number,
    textWidth: number,
    textHeight: number,
  ): { x: number; y: number } => {
    const padding = 20
    const positions: Record<string, { x: number; y: number }> = {
      "top-left": { x: padding, y: padding + textHeight },
      "top-center": { x: (canvasWidth - textWidth) / 2, y: padding + textHeight },
      "top-right": { x: canvasWidth - textWidth - padding, y: padding + textHeight },
      center: { x: (canvasWidth - textWidth) / 2, y: (canvasHeight + textHeight) / 2 },
      "bottom-left": { x: padding, y: canvasHeight - padding },
      "bottom-center": { x: (canvasWidth - textWidth) / 2, y: canvasHeight - padding },
      "bottom-right": { x: canvasWidth - textWidth - padding, y: canvasHeight - padding },
    }
    return positions[watermarkOptions.position] || positions["bottom-right"]
  }

  const applyWatermark = async (imageFile: ImageFile): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        ctx.font = `bold ${watermarkOptions.fontSize}px Arial`
        const textWidth = ctx.measureText(watermarkOptions.text).width
        const textHeight = watermarkOptions.fontSize

        const { x, y } = getPositionCoordinates(canvas.width, canvas.height, textWidth, textHeight)

        ctx.globalAlpha = watermarkOptions.opacity
        ctx.fillStyle = watermarkOptions.color
        ctx.fillText(watermarkOptions.text, x, y)
        ctx.globalAlpha = 1

        canvas.toBlob(
          (blob) => {
            resolve(blob!)
          },
          "image/jpeg",
          0.95,
        )
      }

      img.src = imageFile.preview
    })
  }

  const handleApplyWatermark = async () => {
    setIsApplying(true)
    setProgress(0)

    const watermarkedImages: { blob: Blob; filename: string }[] = []

    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i]
      const watermarkedBlob = await applyWatermark(imageFile)
      const filename = `${imageFile.name.split(".")[0]}_watermarked.jpg`

      watermarkedImages.push({ blob: watermarkedBlob, filename })
      setProgress(((i + 1) / images.length) * 100)
    }

    if (watermarkedImages.length === 1) {
      const { blob, filename } = watermarkedImages[0]
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      for (const { blob, filename } of watermarkedImages) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    }

    setIsApplying(false)
    setIsComplete(true)
  }

  const resetWatermark = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildToolJsonLd("image-watermark")) }}
      />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Protect Your Images
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance"
          >
            Add Watermarks
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Instantly</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Protect your images with custom text watermarks. Add copyright notices, branding, or ownership marks.
          </motion.p>
        </div>

        <div className="space-y-8">
          {images.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                  Upload Your Images
                </h2>

                <motion.div
                  className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-gradient-to-br from-slate-50/50 to-rose-50/50 hover:from-rose-50/50 hover:to-pink-50/50 transition-all duration-300 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
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
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">⚙️</span>
                  </div>
                  Watermark Settings
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="space-y-3">
                    <Label className="text-base font-bold text-slate-800">Watermark Text</Label>
                    <Input
                      type="text"
                      value={watermarkOptions.text}
                      onChange={(e) => setWatermarkOptions({ ...watermarkOptions, text: e.target.value })}
                      placeholder="Enter watermark text"
                      className="h-12 border-2 border-slate-200 focus:border-rose-500 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-slate-800">
                        Font Size ({watermarkOptions.fontSize}px)
                      </Label>
                      <Input
                        type="range"
                        min="10"
                        max="100"
                        value={watermarkOptions.fontSize}
                        onChange={(e) =>
                          setWatermarkOptions({ ...watermarkOptions, fontSize: Number.parseInt(e.target.value) })
                        }
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-bold text-slate-800">
                        Opacity ({Math.round(watermarkOptions.opacity * 100)}%)
                      </Label>
                      <Input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={watermarkOptions.opacity}
                        onChange={(e) =>
                          setWatermarkOptions({ ...watermarkOptions, opacity: Number.parseFloat(e.target.value) })
                        }
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-bold text-slate-800">Watermark Color</Label>
                    <Input
                      type="color"
                      value={watermarkOptions.color}
                      onChange={(e) => setWatermarkOptions({ ...watermarkOptions, color: e.target.value })}
                      className="w-full h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-bold text-slate-800">Position</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "top-left",
                        "top-center",
                        "top-right",
                        "center",
                        "bottom-left",
                        "bottom-center",
                        "bottom-right",
                      ].map((pos) => (
                        <button
                          key={pos}
                          onClick={() =>
                            setWatermarkOptions({
                              ...watermarkOptions,
                              position: pos as WatermarkOptions["position"],
                            })
                          }
                          className={`px-3 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                            watermarkOptions.position === pos
                              ? "bg-rose-500 border-rose-500 text-white"
                              : "bg-white border-slate-200 text-slate-700 hover:border-rose-300"
                          }`}
                        >
                          {pos
                            .split("-")
                            .map((w) => w.charAt(0).toUpperCase())
                            .join("")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleApplyWatermark}
                    disabled={isApplying}
                    className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    {isApplying ? "Applying..." : "Apply Watermark"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetWatermark}
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
                      <p className="text-xs text-slate-500">{image.size}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {isApplying && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-rose-600 border-t-transparent"></div>
                    <span className="font-medium text-slate-700">Applying watermarks...</span>
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
                  <h3 className="font-bold text-lg text-green-700">Watermark Applied!</h3>
                  <p className="text-sm text-green-600">
                    Your images have been watermarked and downloaded successfully.
                  </p>
                </div>
              </div>
              <Button
                onClick={resetWatermark}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Watermark More Images
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Back to Tools</h2>
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                View all tools →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
