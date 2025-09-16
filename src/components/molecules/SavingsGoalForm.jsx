import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const SavingsGoalForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    targetDate: "",
    currentAmount: "",
    notes: ""
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        targetAmount: initialData.targetAmount?.toString() || "",
        targetDate: initialData.targetDate ? 
          new Date(initialData.targetDate).toISOString().split('T')[0] : "",
        currentAmount: initialData.currentAmount?.toString() || "",
        notes: initialData.notes || ""
      })
    }
  }, [initialData])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Goal title is required"
    }
    
    if (!formData.targetAmount || isNaN(formData.targetAmount) || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Please enter a valid target amount"
    }
    
    if (!formData.targetDate) {
      newErrors.targetDate = "Target date is required"
    } else {
      const targetDate = new Date(formData.targetDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (targetDate < today) {
        newErrors.targetDate = "Target date must be in the future"
      }
    }
    
    if (formData.currentAmount && (isNaN(formData.currentAmount) || parseFloat(formData.currentAmount) < 0)) {
      newErrors.currentAmount = "Please enter a valid current amount"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const goal = {
        title: formData.title.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        targetDate: formData.targetDate,
        currentAmount: parseFloat(formData.currentAmount) || 0,
        notes: formData.notes.trim()
      }
      
      await onSubmit(goal)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Goal Title" required error={errors.title}>
        <Input
          type="text"
          placeholder="e.g., Emergency Fund, New Car, Vacation"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          maxLength={100}
        />
      </FormField>
      
      <FormField label="Target Amount" required error={errors.targetAmount}>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.targetAmount}
          onChange={(e) => handleChange("targetAmount", e.target.value)}
        />
      </FormField>
      
      <FormField label="Target Date" required error={errors.targetDate}>
        <Input
          type="date"
          min={getTodayDate()}
          value={formData.targetDate}
          onChange={(e) => handleChange("targetDate", e.target.value)}
        />
      </FormField>
      
      <FormField label="Current Amount" error={errors.currentAmount}>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.currentAmount}
          onChange={(e) => handleChange("currentAmount", e.target.value)}
        />
      </FormField>
      
      <FormField label="Notes (Optional)">
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
          placeholder="Add notes about your savings goal..."
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          maxLength={500}
          rows={4}
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.notes.length}/500 characters
        </div>
      </FormField>
      
      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {initialData ? "Update" : "Create"} Goal
            </>
          )}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default SavingsGoalForm