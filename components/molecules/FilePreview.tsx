import { X } from 'lucide-react'

interface FilePreviewProps {
  image: {
    preview: string
    name: string
    originalFormat: string
    size: string
  }
  onRemove: () => void
}

export const FilePreview: React.FC<FilePreviewProps> = ({ image, onRemove }) => {
  return (
    <div className="group relative bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-slate-200/60 hover:shadow-md transition-all duration-200">
      <div className="relative">
        <img
          src={image.preview}
          alt={image.name}
          className="w-full h-20 object-cover rounded-lg mb-2"
        />
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <p className="text-xs font-semibold text-slate-700 truncate">{image.name}</p>
      <p className="text-xs text-slate-500">
        {image.originalFormat.toUpperCase()} • {image.size}
      </p>
    </div>
  )
}