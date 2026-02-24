interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  disabled?: boolean
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full h-12 rounded-xl border-2 border-slate-200 cursor-pointer 
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:border-slate-300 focus:border-blue-500
        transition-colors duration-200
      "
    />
  )
}