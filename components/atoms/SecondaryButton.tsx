import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface SecondaryButtonProps {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  icon?: LucideIcon
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ 
  onClick, 
  disabled, 
  children, 
  icon: Icon 
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        px-6 py-3 rounded-xl font-semibold
        bg-white/80 backdrop-blur-sm
        border border-slate-300/60
        text-slate-700
        hover:bg-white hover:border-slate-400
        disabled:bg-slate-100 disabled:text-slate-400
        disabled:cursor-not-allowed
        shadow-sm hover:shadow-md
        transition-all duration-200
        flex items-center justify-center gap-2
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.button>
  )
}