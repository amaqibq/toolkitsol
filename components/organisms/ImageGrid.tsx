"use client"

import { motion } from 'framer-motion'
import { ImageCard } from '../molecules/ImageCard'

interface ImageFile {
  id: string
  preview: string
  name: string
  originalFormat: string
  size: string
}

interface ImageGridProps {
  images: ImageFile[]
  onRemoveImage: (id: string) => void
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemoveImage }) => {
  if (images.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Uploaded Images ({images.length})
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ImageCard
              image={image}
              onRemove={onRemoveImage}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}