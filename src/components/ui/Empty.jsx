import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No data available", 
  description = "Get started by adding your first item.", 
  actionLabel = "Get Started",
  onAction,
  icon = "Database",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <div className="bg-primary-50 rounded-full p-4 mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty