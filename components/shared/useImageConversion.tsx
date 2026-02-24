"use client"

import { useState, useCallback } from 'react'

interface ConversionOptions {
  format: 'png' | 'jpeg' | 'webp'
  quality: number
  backgroundColor: string
}

interface ImageFile {
  id: string
  file: File
  preview: string
  name: string
  size: number
  originalFormat: string
}

export const useImageConversion = () => {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const convertImage = useCallback(async (image: ImageFile, options: ConversionOptions): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        
        if (options.format === 'jpeg') {
          ctx.fillStyle = options.backgroundColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob(
          (blob) => resolve(blob!),
          `image/${options.format}`,
          options.quality / 100
        )
      }
      
      img.src = image.preview
    })
  }, [])

  const downloadSingle = useCallback(({ blob, filename }: { blob: Blob; filename: string }) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  const downloadMultiple = useCallback((images: { blob: Blob; filename: string }[]) => {
    images.forEach(({ blob, filename }) => {
      downloadSingle({ blob, filename })
    })
  }, [downloadSingle])

  const convertBatch = useCallback(async (options: ConversionOptions) => {
    setIsConverting(true)
    setProgress(0)
    
    const convertedImages: { blob: Blob; filename: string }[] = []
    
    for (let i = 0; i < images.length; i++) {
      try {
        const blob = await convertImage(images[i], options)
        const filename = `${images[i].name.split('.')[0]}.${options.format}`
        convertedImages.push({ blob, filename })
        
        setProgress(((i + 1) / images.length) * 100)
      } catch (error) {
        console.error(`Failed to convert ${images[i].name}:`, error)
      }
    }
    
    if (convertedImages.length === 1) {
      downloadSingle(convertedImages[0])
    } else {
      downloadMultiple(convertedImages)
    }
    
    setIsConverting(false)
    setIsComplete(true)
  }, [images, convertImage, downloadSingle, downloadMultiple])

  const addImages = useCallback((files: File[]) => {
    const newImages: ImageFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      originalFormat: file.type.split('/')[1] || 'unknown'
    }))
    
    setImages(prev => [...prev, ...newImages])
  }, [])

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter(img => img.id !== id)
    })
  }, [])

  const reset = useCallback(() => {
    images.forEach(img => URL.revokeObjectURL(img.preview))
    setImages([])
    setIsComplete(false)
    setProgress(0)
  }, [images])

  return {
    images: images.map(img => ({
      ...img,
      size: `${(img.size / 1024 / 1024).toFixed(2)} MB`
    })),
    isConverting,
    progress,
    isComplete,
    convertBatch,
    addImages,
    removeImage,
    reset
  }
}