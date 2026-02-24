"use client"

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { PrimaryButton } from '../atoms/PrimaryButton'

interface SuccessStateProps {
  onReset: () => void
}

export const SuccessState: React.FC<SuccessStateProps> = ({ onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200/50 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-green-800">Conversion Complete!</h3>
          <p className="text-green-700">
            Your images have been converted and downloaded successfully.
          </p>
        </div>
        
        <PrimaryButton onClick={onReset}>
          Convert More Images
        </PrimaryButton>
      </div>
    </motion.div>
  )
}