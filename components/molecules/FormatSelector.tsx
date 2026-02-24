"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

interface FormatSelectorProps {
  value: 'png' | 'jpeg' | 'webp'
  onChange: (value: 'png' | 'jpeg' | 'webp') => void
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-800 block">Output Format</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 bg-white/80 border-slate-300/60 rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200 rounded-xl">
          <SelectItem value="png" className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>PNG (Transparent)</span>
          </SelectItem>
          <SelectItem value="jpeg" className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>JPG (Solid)</span>
          </SelectItem>
          <SelectItem value="webp" className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>WebP (Modern)</span>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200/50">
        <p className="text-sm font-medium text-blue-800">
          Format: <span className="font-bold">{value.toUpperCase()}</span>
        </p>
        {value === 'png' || value === 'webp' ? (
          <p className="text-xs text-blue-700 mt-1">✓ Transparency supported</p>
        ) : (
          <p className="text-xs text-blue-700 mt-1">Background color applied</p>
        )}
      </div>
    </div>
  )
}