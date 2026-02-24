"use client"

import { useState, useRef } from "react"
import { ToolShell } from "../../../components/templates/ToolShell"
import { DropZone } from "../../../components/molecules/DropZone"
import { ControlPanel } from "../../../components/organisms/ControlPanel"
import { ImageGrid } from "../../../components/organisms/ImageGrid"
import { ConversionStatus } from "../../../components/organisms/ConversionStatus"
import { SuccessState } from "../../../components/organisms/SuccessState"
import { useImageConversion } from "../../../components/shared/useImageConversion"

export default function ImageConverterPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [conversionOptions, setConversionOptions] = useState({
    format: 'png' as 'png' | 'jpeg' | 'webp',
    quality: 90,
    backgroundColor: '#ffffff'
  })

  const {
    images,
    isConverting,
    progress,
    isComplete,
    convertBatch,
    addImages,
    removeImage,
    reset
  } = useImageConversion()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
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
          originalFormat: file.type.split("/")[1],
        })
        setImages((prevImages) => [...prevImages, ...newImages])
      }
      reader.readAsDataURL(file)
    }
  }

  const convertImage = async (imageFile: ImageFile): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        const shouldApplyBackground = conversionOptions.format === "jpeg" || conversionOptions.useBackgroundColor
        if (shouldApplyBackground) {
          ctx.fillStyle = conversionOptions.backgroundColor || "#ffffff"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
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

  const handleFormatChange = (value: string) => {
    const useBackground = value === "jpeg"
    setConversionOptions({
      ...conversionOptions,
      format: value,
      useBackgroundColor: useBackground,
    })
  }

  const handleConvert = async () => {
    await convertBatch(conversionOptions)
  }

  const handleReset = () => {
    reset()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Show header only when images are uploaded
  const showHeader = images.length > 0 || isComplete

  return (
    <div className="min-h-screen flex flex-col">
      <ToolShell
        title="Image Converter"
        subtitle="Fast & High Quality"
        description="Convert images between formats with quality control"
        showHeader={showHeader}
      >
        {images.length === 0 && !isComplete && (
          <DropZone
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          />
        )}

        {images.length > 0 && !isComplete && (
          <div className="flex-1 flex flex-col p-4 space-y-4">
            <ControlPanel
              options={conversionOptions}
              onOptionsChange={setConversionOptions}
              onConvert={handleConvert}
              onReset={handleReset}
              isConverting={isConverting}
              hasImages={images.length > 0}
            />

            <div className="flex-1 min-h-0">
              <ImageGrid
                images={images}
                onRemoveImage={removeImage}
              />
            </div>

            {isConverting && (
              <ConversionStatus progress={progress} />
            )}
          </div>
        )}

        {isComplete && (
          <div className="flex-1 flex items-center justify-center p-4">
            <SuccessState onReset={handleReset} />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </ToolShell>


    </div>
  )
}