import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface PrimaryButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  icon?: LucideIcon
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  onClick, 
  disabled, 
  loading, 
  children, 
  icon: Icon 
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -1
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative px-8 py-4 rounded-2xl font-semibold text-white
        bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600
        hover:from-blue-700 hover:via-blue-600 hover:to-cyan-700
        disabled:from-slate-400 disabled:to-slate-500
        disabled:cursor-not-allowed
        shadow-lg hover:shadow-xl shadow-blue-500/25
        transition-all duration-300
        flex items-center justify-center gap-3
        min-w-[140px]
        overflow-hidden
      `}
    >
      {/* Animated background shine */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
        />
      )}
      {Icon && !loading && <Icon className="w-5 h-5" />}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}