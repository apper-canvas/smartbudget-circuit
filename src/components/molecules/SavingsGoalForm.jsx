import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";

const SavingsGoalForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title_c: "",
    target_amount_c: "",
    target_date_c: "",
    current_amount_c: "",
    notes_c: "",
    goal_term_c: "short term",
})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

useEffect(() => {
    if (initialData) {
      setFormData({
        title_c: initialData.title_c || "",
        target_amount_c: initialData.target_amount_c?.toString() || "",
        target_date_c: initialData.target_date_c ? 
          new Date(initialData.target_date_c).toISOString().split('T')[0] : "",
        current_amount_c: initialData.current_amount_c?.toString() || "",
        notes_c: initialData.notes_c || "",
        goal_term_c: initialData.goal_term_c || "short term",
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
    
    if (!formData.title_c.trim()) {
      newErrors.title_c = "Goal title is required"
    }
    
    if (!formData.target_amount_c || isNaN(formData.target_amount_c) || parseFloat(formData.target_amount_c) <= 0) {
      newErrors.target_amount_c = "Please enter a valid target amount"
    }
    
    if (!formData.target_date_c) {
      newErrors.target_date_c = "Target date is required"
    } else {
      const targetDate = new Date(formData.target_date_c)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (targetDate < today) {
        newErrors.target_date_c = "Target date must be in the future"
      }
    }
    
    if (formData.current_amount_c && (isNaN(formData.current_amount_c) || parseFloat(formData.current_amount_c) < 0)) {
      newErrors.current_amount_c = "Please enter a valid current amount"
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
        title_c: formData.title_c.trim(),
        target_amount_c: parseFloat(formData.target_amount_c),
        target_date_c: formData.target_date_c,
        current_amount_c: parseFloat(formData.current_amount_c) || 0,
        notes_c: formData.notes_c.trim(),
        goal_term_c: formData.goal_term_c,
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
      <FormField label="Goal Title" required error={errors.title_c}>
        <Input
          type="text"
          placeholder="e.g., Emergency Fund, New Car, Vacation"
          value={formData.title_c}
          onChange={(e) => handleChange("title_c", e.target.value)}
          maxLength={100}
        />
      </FormField>
      
      <FormField label="Target Amount" required error={errors.target_amount_c}>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.target_amount_c}
          onChange={(e) => handleChange("target_amount_c", e.target.value)}
        />
      </FormField>
      
      <FormField label="Target Date" required error={errors.target_date_c}>
        <Input
          type="date"
          min={getTodayDate()}
          value={formData.target_date_c}
          onChange={(e) => handleChange("target_date_c", e.target.value)}
        />
      </FormField>
      
      <FormField label="Current Amount" error={errors.current_amount_c}>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.current_amount_c}
          onChange={(e) => handleChange("current_amount_c", e.target.value)}
        />
      </FormField>

{/* Removed decimal field as it doesn't exist in database schema */}

{/* Removed multi-picklist field as it doesn't exist in database schema */}

{/* Removed range field as it doesn't exist in database schema */}

{/* Removed boolean field as it doesn't exist in database schema */}

{/* Removed email field as it doesn't exist in database schema */}

{/* Removed checkbox field as it doesn't exist in database schema */}

<FormField label="Goal Term" error={errors.goal_term_c}>
        <select
          className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          value={formData.goal_term_c}
          onChange={(e) => handleChange("goal_term_c", e.target.value)}
        >
          <option value="short term">Short Term</option>
          <option value="long term">Long Term</option>
          <option value="immediate">Immediate</option>
        </select>
      </FormField>


{/* Removed radio field as it doesn't exist in database schema */}

{/* Removed phone field as it doesn't exist in database schema */}

{/* Removed website field as it doesn't exist in database schema */}
      
      <FormField label="Notes (Optional)">
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
          placeholder="Add notes about your savings goal..."
          value={formData.notes_c}
          onChange={(e) => handleChange("notes_c", e.target.value)}
          maxLength={500}
          rows={4}
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.notes_c.length}/500 characters
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