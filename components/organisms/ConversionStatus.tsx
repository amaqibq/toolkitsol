"use client"

import { motion } from 'framer-motion'
import { ProgressRing } from '../atoms/ProgressRing'

interface ConversionStatusProps {
  progress: number
}

export const ConversionStatus: React.FC<ConversionStatusProps> = ({ progress }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50"
    >
      <div className="flex items-center gap-4">
        <ProgressRing progress={progress} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="font-medium text-slate-700">Converting images...</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            {Math.round(progress)}% complete • Processing your images
          </p>
        </div>
      </div>
    </motion.div>
  )
}