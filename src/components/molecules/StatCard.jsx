import React from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const StatCard = ({ title, value, subtitle, icon, trend, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    success: "text-green-600 bg-green-50",
    warning: "text-amber-600 bg-amber-50",
    danger: "text-red-600 bg-red-50",
    info: "text-blue-600 bg-blue-50"
  }
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && (
              <div className="flex items-center">
                <p className="text-sm text-gray-500">{subtitle}</p>
                {trend && (
                  <div className={cn(
                    "ml-2 flex items-center text-xs font-medium",
                    trend.direction === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    <ApperIcon 
                      name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
                      className="w-3 h-3 mr-1" 
                    />
                    {trend.value}
                  </div>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn("p-3 rounded-lg", colorClasses[color])}>
              <ApperIcon name={icon} className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard