import React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
info: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge