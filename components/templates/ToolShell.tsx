"use client"

import { motion } from 'framer-motion'

interface ToolShellProps {
  title: string
  subtitle: string
  description: string
  children: React.ReactNode
  showHeader?: boolean
}

export const ToolShell: React.FC<ToolShellProps> = ({ 
  title, 
  subtitle, 
  description, 
  children,
  showHeader = true
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/10 to-indigo-100/5">
      <div className="flex-1">
        {/* Only show header if there are images uploaded */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6 px-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-xs mb-3">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">{subtitle}</span>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {title}
            </h1>
            
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              {description}
            </p>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}