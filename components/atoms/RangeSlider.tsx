interface RangeSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  onChange,
  min = 10,
  max = 100,
  step = 1
}) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
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
  )
}