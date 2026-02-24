interface QualityControlProps {
  quality: number
  onChange: (quality: number) => void
}

export const QualityControl: React.FC<QualityControlProps> = ({ quality, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-slate-800">Quality</label>
        <span className="text-sm font-bold text-blue-600">{quality}%</span>
      </div>
      
      <input
        type="range"
        min="10"
        max="100"
        step="5"
        value={quality}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-blue-600
          [&::-webkit-slider-thumb]:hover:bg-blue-700
          [&::-webkit-slider-thumb]:transition-colors
        "
      />
      
      <div className="flex justify-between text-xs text-slate-500">
        <span>Smaller File</span>
        <span>Better Quality</span>
      </div>
    </div>
  )
}