import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const SavingsGoalForm = ({ onSubmit, onCancel, initialData = null }) => {
const [formData, setFormData] = useState({
    title_c: "",
    target_amount_c: "",
    target_date_c: "",
    current_amount_c: "",
    notes_c: "",
    decimal_rate_c: "",
    categories_c: "",
    priority_range_c: "1-5",
    is_active_c: true,
    contact_email_c: "",
    goal_tags_c: "",
    reminder_datetime_c: "",
    features_c: "",
    goal_type_c: "personal",
    contact_phone_c: "",
    reference_url_c: "",
    importance_rating_c: 3
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
        decimal_rate_c: initialData.decimal_rate_c?.toString() || "",
        categories_c: initialData.categories_c || "",
        priority_range_c: initialData.priority_range_c || "1-5",
        is_active_c: initialData.is_active_c !== undefined ? initialData.is_active_c : true,
        contact_email_c: initialData.contact_email_c || "",
        goal_tags_c: initialData.goal_tags_c || "",
        reminder_datetime_c: initialData.reminder_datetime_c ? 
          new Date(initialData.reminder_datetime_c).toISOString().slice(0, 16) : "",
        features_c: initialData.features_c || "",
        goal_type_c: initialData.goal_type_c || "personal",
        contact_phone_c: initialData.contact_phone_c || "",
        reference_url_c: initialData.reference_url_c || "",
        importance_rating_c: initialData.importance_rating_c || 3
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

    // Decimal validation
    if (formData.decimal_rate_c && (isNaN(formData.decimal_rate_c) || parseFloat(formData.decimal_rate_c) < 0)) {
      newErrors.decimal_rate_c = "Please enter a valid decimal rate"
    }

    // Email validation
    if (formData.contact_email_c) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.contact_email_c)) {
        newErrors.contact_email_c = "Please enter a valid email address"
      }
    }

    // Phone validation
    if (formData.contact_phone_c) {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
      if (!phoneRegex.test(formData.contact_phone_c)) {
        newErrors.contact_phone_c = "Please enter a valid phone number"
      }
    }

    // Website validation
    if (formData.reference_url_c) {
      try {
        new URL(formData.reference_url_c)
      } catch {
        newErrors.reference_url_c = "Please enter a valid website URL"
      }
    }

    // Rating validation
    if (formData.importance_rating_c && (formData.importance_rating_c < 1 || formData.importance_rating_c > 5)) {
      newErrors.importance_rating_c = "Rating must be between 1 and 5"
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
        decimal_rate_c: parseFloat(formData.decimal_rate_c) || null,
        categories_c: formData.categories_c,
        priority_range_c: formData.priority_range_c,
        is_active_c: formData.is_active_c,
        contact_email_c: formData.contact_email_c.trim(),
        goal_tags_c: formData.goal_tags_c,
        reminder_datetime_c: formData.reminder_datetime_c ? new Date(formData.reminder_datetime_c).toISOString() : null,
        features_c: formData.features_c,
        goal_type_c: formData.goal_type_c,
        contact_phone_c: formData.contact_phone_c.trim(),
        reference_url_c: formData.reference_url_c.trim(),
        importance_rating_c: parseInt(formData.importance_rating_c)
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

      <FormField label="Interest/Growth Rate (%)" error={errors.decimal_rate_c}>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="e.g., 2.5"
          value={formData.decimal_rate_c}
          onChange={(e) => handleChange("decimal_rate_c", e.target.value)}
        />
      </FormField>

      <FormField label="Goal Categories" error={errors.categories_c}>
        <Input
          type="text"
          placeholder="e.g., Emergency,Vacation,Education"
          value={formData.categories_c}
          onChange={(e) => handleChange("categories_c", e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-1">
          Separate multiple categories with commas
        </div>
      </FormField>

      <FormField label="Priority Range" error={errors.priority_range_c}>
        <select
          className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          value={formData.priority_range_c}
          onChange={(e) => handleChange("priority_range_c", e.target.value)}
        >
          <option value="1-5">Low Priority (1-5)</option>
          <option value="6-10">Medium Priority (6-10)</option>
          <option value="11-15">High Priority (11-15)</option>
          <option value="16-20">Critical Priority (16-20)</option>
        </select>
      </FormField>

      <FormField label="Goal Status" error={errors.is_active_c}>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active_c}
            onChange={(e) => handleChange("is_active_c", e.target.checked)}
            className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">
            Goal is active
          </label>
        </div>
      </FormField>

      <FormField label="Contact Email" error={errors.contact_email_c}>
        <Input
          type="email"
          placeholder="your@email.com"
          value={formData.contact_email_c}
          onChange={(e) => handleChange("contact_email_c", e.target.value)}
        />
      </FormField>

      <FormField label="Goal Tags" error={errors.goal_tags_c}>
        <Input
          type="text"
          placeholder="e.g., urgent,family,investment"
          value={formData.goal_tags_c}
          onChange={(e) => handleChange("goal_tags_c", e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-1">
          Separate multiple tags with commas
        </div>
      </FormField>

      <FormField label="Reminder Date & Time" error={errors.reminder_datetime_c}>
        <Input
          type="datetime-local"
          value={formData.reminder_datetime_c}
          onChange={(e) => handleChange("reminder_datetime_c", e.target.value)}
        />
      </FormField>

      <FormField label="Goal Features" error={errors.features_c}>
        <div className="space-y-2">
          {["Auto-save", "Progress tracking", "Milestone alerts", "Visual charts"].map(feature => (
            <div key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`feature-${feature}`}
                checked={formData.features_c.split(',').includes(feature)}
                onChange={(e) => {
                  const currentFeatures = formData.features_c ? formData.features_c.split(',').filter(f => f) : []
                  if (e.target.checked) {
                    handleChange("features_c", [...currentFeatures, feature].join(','))
                  } else {
                    handleChange("features_c", currentFeatures.filter(f => f !== feature).join(','))
                  }
                }}
                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor={`feature-${feature}`} className="text-sm text-gray-700">
                {feature}
              </label>
            </div>
          ))}
        </div>
      </FormField>

      <FormField label="Goal Type" error={errors.goal_type_c}>
        <div className="space-y-2">
          {[
            { value: "personal", label: "Personal Goal" },
            { value: "family", label: "Family Goal" },
            { value: "business", label: "Business Goal" },
            { value: "education", label: "Education Goal" }
          ].map(type => (
            <div key={type.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`type-${type.value}`}
                name="goal_type"
                value={type.value}
                checked={formData.goal_type_c === type.value}
                onChange={(e) => handleChange("goal_type_c", e.target.value)}
                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor={`type-${type.value}`} className="text-sm text-gray-700">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </FormField>

      <FormField label="Contact Phone" error={errors.contact_phone_c}>
        <Input
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.contact_phone_c}
          onChange={(e) => handleChange("contact_phone_c", e.target.value)}
        />
      </FormField>

      <FormField label="Reference Website" error={errors.reference_url_c}>
        <Input
          type="url"
          placeholder="https://example.com"
          value={formData.reference_url_c}
          onChange={(e) => handleChange("reference_url_c", e.target.value)}
        />
      </FormField>

      <FormField label="Importance Rating" error={errors.importance_rating_c}>
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => handleChange("importance_rating_c", rating)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                formData.importance_rating_c >= rating
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'bg-white border-gray-300 text-gray-500 hover:border-primary-300'
              }`}
            >
              {rating}
            </button>
          ))}
          <span className="text-sm text-gray-500 ml-2">
            ({formData.importance_rating_c}/5)
          </span>
        </div>
      </FormField>
      
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