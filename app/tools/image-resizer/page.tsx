"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, ImageIcon, CheckCircle, X, Sparkles, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { buildToolJsonLd } from "@/lib/seo"

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
}

interface ResizeOptions {
  width: number
  height: number
  maintainAspectRatio: boolean
  unit: "px" | "%"
}

export default function ImageResizerPage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isResizing, setIsResizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    unit: "px",
  })
  const [isComplete, setIsComplete] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewDimensions, setPreviewDimensions] = useState<{ width: number; height: number } | null>(null)
  const [zoom, setZoom] = useState(100)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (images.length > 0) {
      generatePreview(images[0])
    }
  }, [resizeOptions, images])

  useEffect(() => {
    setZoom(100)
    setPanX(0)
    setPanY(0)
  }, [previewImage])

  const generatePreview = async (imageFile: ImageFile) => {
    return new Promise<void>((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const newWidth = resizeOptions.width
        let newHeight = resizeOptions.height

        if (resizeOptions.maintainAspectRatio) {
          const aspectRatio = img.width / img.height
          newHeight = Math.round(newWidth / aspectRatio)
        }

        canvas.width = newWidth
        canvas.height = newHeight
        ctx.drawImage(img, 0, 0, newWidth, newHeight)

        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob!)
            setPreviewImage(url)
            setPreviewDimensions({ width: newWidth, height: newHeight })
            resolve()
          },
          "image/jpeg",
          0.9,
        )
      }

      img.src = imageFile.preview
    })
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 300))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }

  const handleResetZoom = () => {
    setZoom(100)
    setPanX(0)
    setPanY(0)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom > 100) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - panX, y: e.clientY - panY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && previewContainerRef.current) {
      const container = previewContainerRef.current
      const maxPanX = (container.offsetWidth * (zoom - 100)) / 200
      const maxPanY = (container.offsetHeight * (zoom - 100)) / 200

      let newPanX = e.clientX - dragStart.x
      let newPanY = e.clientY - dragStart.y

      newPanX = Math.max(-maxPanX, Math.min(maxPanX, newPanX))
      newPanY = Math.max(-maxPanY, Math.min(maxPanY, newPanY))

      setPanX(newPanX)
      setPanY(newPanY)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    handleFileSelect(files)
  }

  const handleFileSelect = (files: File[] | React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.isArray(files) ? files : Array.from(files.target.files || [])
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

  const resizeImage = async (imageFile: ImageFile): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const newWidth = resizeOptions.width
        let newHeight = resizeOptions.height

        if (resizeOptions.maintainAspectRatio) {
          const aspectRatio = img.width / img.height
          newHeight = Math.round(newWidth / aspectRatio)
        }

        canvas.width = newWidth
        canvas.height = newHeight
        ctx.drawImage(img, 0, 0, newWidth, newHeight)

        canvas.toBlob(
          (blob) => {
            resolve(blob!)
          },
          "image/jpeg",
          0.9,
        )
      }

      img.src = imageFile.preview
    })
  }

  const handleResize = async () => {
    setIsResizing(true)
    setProgress(0)

    const resizedImages: { blob: Blob; filename: string }[] = []

    for (let i = 0; i < images.length; i++) {
      const imageFile = images[i]
      const resizedBlob = await resizeImage(imageFile)
      const filename = `${imageFile.name.split(".")[0]}_resized.jpg`

      resizedImages.push({ blob: resizedBlob, filename })
      setProgress(((i + 1) / images.length) * 100)
    }

    for (const { blob, filename } of resizedImages) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    setIsResizing(false)
    setIsComplete(true)
  }

  const resetResizer = () => {
    setImages([])
    setIsComplete(false)
    setProgress(0)
    setPreviewImage(null)
    setPreviewDimensions(null)
    handleResetZoom()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (indexToRemove: number) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setImages(images.filter((_, index) => index !== indexToRemove))
    }
  }

  const presets = [
    { name: "Thumbnail", width: 200, height: 200 },
    { name: "Social Media", width: 1200, height: 630 },
    { name: "HD", width: 1920, height: 1080 },
    { name: "Square", width: 500, height: 500 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildToolJsonLd("image-resizer")) }}
      />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Resize with Precision
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-balance"
          >
            Resize Images
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Perfectly
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty"
          >
            Resize images to any dimensions with smart scaling and aspect ratio control. Perfect for all your needs.
          </motion.p>
        </div>

        <div className="space-y-8">
          {images.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                  Upload Your Images
                </h2>

                <motion.div
                  className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-gradient-to-br from-slate-50/50 to-indigo-50/50 hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-1 bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 h-fit"
                >
                  <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">⚙️</span>
                    </div>
                    Resize Settings
                  </h2>

                  <div className="space-y-6 mb-8">
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-slate-800">Width</Label>
                      <Input
                        type="number"
                        value={resizeOptions.width}
                        onChange={(e) =>
                          setResizeOptions({ ...resizeOptions, width: Number.parseInt(e.target.value) || 0 })
                        }
                        className="h-12 border-2 border-slate-200 focus:border-indigo-500 rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-base font-bold text-slate-800">Height</Label>
                      <Input
                        type="number"
                        value={resizeOptions.height}
                        onChange={(e) =>
                          setResizeOptions({ ...resizeOptions, height: Number.parseInt(e.target.value) || 0 })
                        }
                        disabled={resizeOptions.maintainAspectRatio}
                        className="h-12 border-2 border-slate-200 focus:border-indigo-500 rounded-xl disabled:opacity-50"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={resizeOptions.maintainAspectRatio}
                        onChange={(e) => setResizeOptions({ ...resizeOptions, maintainAspectRatio: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <span className="text-sm font-medium text-slate-700">Maintain Aspect Ratio</span>
                    </label>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
                      <p className="text-sm font-semibold text-indigo-800 mb-3">Quick Presets</p>
                      <div className="grid grid-cols-2 gap-2">
                        {presets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() =>
                              setResizeOptions({
                                ...resizeOptions,
                                width: preset.width,
                                height: preset.height,
                              })
                            }
                            className="px-3 py-2 text-xs font-medium bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <Button
                      onClick={handleResize}
                      disabled={isResizing}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                      {isResizing ? "Resizing..." : "Start Resize"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetResizer}
                      className="w-full py-3 rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 bg-transparent"
                    >
                      Reset
                    </Button>
                  </div>
                </motion.div>

                <div className="lg:col-span-2 space-y-8">
                  {previewImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-slate-900 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">👁️</span>
                          </div>
                          Live Preview
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-600">{zoom}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <Button
                          onClick={handleZoomOut}
                          disabled={zoom <= 50}
                          className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:opacity-50"
                        >
                          <ZoomOut className="w-4 h-4" />
                          Zoom Out
                        </Button>
                        <Button
                          onClick={handleResetZoom}
                          variant="outline"
                          className="border-slate-300 hover:bg-slate-50 bg-transparent"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset
                        </Button>
                        <Button
                          onClick={handleZoomIn}
                          disabled={zoom >= 300}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
                        >
                          <ZoomIn className="w-4 h-4" />
                          Zoom In
                        </Button>
                      </div>

                      <div className="mb-4">
                        <input
                          type="range"
                          min="50"
                          max="300"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div
                        ref={previewContainerRef}
                        className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center min-h-64 overflow-hidden cursor-grab active:cursor-grabbing"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        <div
                          className="transition-transform duration-75"
                          style={{
                            transform: `scale(${zoom / 100}) translate(${panX}px, ${panY}px)`,
                            transformOrigin: "center",
                          }}
                        >
                          <img
                            src={previewImage || "/placeholder.svg"}
                            alt="Preview"
                            className="max-w-full max-h-64 rounded-lg shadow-lg object-contain pointer-events-none"
                            draggable={false}
                          />
                        </div>
                        {previewDimensions && (
                          <div className="mt-6 text-center">
                            <p className="text-sm text-slate-600 mb-2">New Dimensions</p>
                            <p className="text-2xl font-bold text-slate-900">
                              {previewDimensions.width} × {previewDimensions.height}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">pixels</p>
                          </div>
                        )}
                      </div>
                      {zoom > 100 && (
                        <p className="text-xs text-slate-500 mt-3 text-center">Drag to pan around the image</p>
                      )}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
                  >
                    <h2 className="text-2xl font-semibold text-slate-900 mb-6">Uploaded Images ({images.length})</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                </div>
              </div>

              {isResizing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                    <span className="font-medium text-slate-700">Resizing images...</span>
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
                  <h3 className="font-bold text-lg text-green-700">Resize Complete!</h3>
                  <p className="text-sm text-green-600">Your images have been resized and downloaded successfully.</p>
                </div>
              </div>
              <Button
                onClick={resetResizer}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Resize More Images
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
