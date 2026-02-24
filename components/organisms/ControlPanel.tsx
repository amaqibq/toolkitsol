"use client"

import { motion } from 'framer-motion'
import { PrimaryButton } from '../atoms/PrimaryButton'
import { SecondaryButton } from '../atoms/SecondaryButton'
import { FormatSelector } from '../molecules/FormatSelector'
import { QualityControl } from '../molecules/QualityControl'
import { ColorPicker } from '../atoms/ColorPicker'

interface ConversionOptions {
  format: 'png' | 'jpeg' | 'webp'
  quality: number
  backgroundColor: string
}

interface ControlPanelProps {
  options: ConversionOptions
  onOptionsChange: (options: ConversionOptions) => void
  onConvert: () => void
  onReset: () => void
  isConverting: boolean
  hasImages: boolean
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  onOptionsChange,
  onConvert,
  onReset,
  isConverting,
  hasImages
}) => {
  const handleFormatChange = (format: 'png' | 'jpeg' | 'webp') => {
    onOptionsChange({ ...options, format })
  }

  const handleQualityChange = (quality: number) => {
    onOptionsChange({ ...options, quality })
  }

  const handleColorChange = (backgroundColor: string) => {
    onOptionsChange({ ...options, backgroundColor })
  }

  const isBackgroundDisabled = options.format !== 'jpeg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25"
          whileHover={{ rotate: 5, scale: 1.05 }}
        >
          <span className="text-white text-lg">⚙️</span>
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Conversion Settings</h2>
          <p className="text-slate-600 mt-1">Customize your output preferences</p>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FormatSelector
            value={options.format}
            onChange={handleFormatChange}
          />
        </motion.div>
        
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <QualityControl
            quality={options.quality}
            onChange={handleQualityChange}
          />
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-800">Background Color</label>
            {isBackgroundDisabled && (
              <span className="text-xs text-slate-500 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">Auto</span>
            )}
          </div>
          
          <ColorPicker
            value={options.backgroundColor}
            onChange={handleColorChange}
            disabled={isBackgroundDisabled}
          />
          
          {isBackgroundDisabled ? (
            <p className="text-xs text-slate-500 bg-blue-50/50 p-3 rounded-xl border border-blue-200/50">
              Background is automatically handled for {options.format.toUpperCase()} format
            </p>
          ) : (
            <p className="text-xs text-slate-500 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
              Selected color will be applied as background
            </p>
          )}
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <PrimaryButton
          onClick={onConvert}
          disabled={!hasImages || isConverting}
          loading={isConverting}
        >
          {isConverting ? 'Converting...' : 'Start Conversion'}
        </PrimaryButton>
        
        <SecondaryButton 
          onClick={onReset}
          disabled={isConverting}
        >
          Reset All
        </SecondaryButton>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/60"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">
              Converting to <span className="text-blue-600">{options.format.toUpperCase()}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {options.quality}% quality • {options.format === 'jpeg' ? 'Solid background' : 'Transparency supported'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}