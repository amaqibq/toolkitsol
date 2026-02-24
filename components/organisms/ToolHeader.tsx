import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface ToolHeaderProps {
  title: string
  subtitle: string
  description: string
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ title, subtitle, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-6">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-semibold text-slate-700">{subtitle}</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
        {title}
        <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Made Simple
        </span>
      </h1>
      
      <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}