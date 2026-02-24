import { motion } from "framer-motion"
import { UploadCloud, Image, ShieldCheck, Zap } from "lucide-react"
import { useState } from "react"

interface DropZoneProps {
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onClick: () => void
}

export const DropZone = ({ onDragOver, onDrop, onClick }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
        onDragOver(e)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        setIsDragging(false)
        onDrop(e)
      }}
      className={`fixed inset-0 transition-all duration-300 flex items-center justify-center
        ${isDragging 
          ? "bg-blue-50/70 backdrop-blur-md" 
          : "bg-gradient-to-br from-slate-50 to-indigo-50"
        }`}
    >
      {/* CENTER CARD */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`max-w-md w-full mx-4 rounded-3xl p-8 border transition-all shadow-xl
          ${isDragging 
            ? "border-blue-500 bg-white shadow-blue-200/50" 
            : "border-slate-200 bg-white"
          }`}
      >
        {/* ICON */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
          <UploadCloud className="w-10 h-10 text-white" />
        </div>

        {/* TEXT */}
        <h2 className="text-2xl font-bold text-center text-slate-900">
          Drop images anywhere
        </h2>
        <p className="text-center text-slate-600 mt-2">
          Drag & drop files or use button below
        </p>

        {/* CTA - ONLY BUTTON OPENS FILE PICKER */}
        <button
          onClick={onClick}
          className="mt-6 w-full py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-blue-500 to-indigo-500
          hover:scale-[1.02] transition-all"
        >
          Choose Files
        </button>

        {/* INFO */}
        <div className="grid grid-cols-2 gap-3 mt-5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-blue-500" /> PNG, JPG, WEBP
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" /> Fast Convert
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" /> Secure
          </div>
          <div className="flex items-center gap-2">✅ Unlimited</div>
        </div>
      </motion.div>
    </motion.div>
    
  )
}
