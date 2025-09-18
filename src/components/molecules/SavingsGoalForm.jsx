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
    decimal_field_c: "",
    multi_picklist_field_c: "",
    range_field_c: "1",
    boolean_field_c: true,
    email_field_c: "",
    checkbox_field_c: "",
    radio_field_c: "Option1",
    phone_field_c: "",
    website_field_c: "",
    goal_term_c: "short term",
    completion_rate_c: "0"
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
        decimal_field_c: initialData.decimal_field_c?.toString() || "",
        multi_picklist_field_c: initialData.multi_picklist_field_c || "",
        range_field_c: initialData.range_field_c?.toString() || "1",
        boolean_field_c: initialData.boolean_field_c !== undefined ? initialData.boolean_field_c : true,
        email_field_c: initialData.email_field_c || "",
        checkbox_field_c: initialData.checkbox_field_c || "",
        radio_field_c: initialData.radio_field_c || "Option1",
        phone_field_c: initialData.phone_field_c || "",
        website_field_c: initialData.website_field_c || "",
        goal_term_c: initialData.goal_term_c || "short term",
        completion_rate_c: initialData.completion_rate_c ? (initialData.completion_rate_c * 100).toString() : "0"
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
if (formData.decimal_field_c && (isNaN(formData.decimal_field_c) || parseFloat(formData.decimal_field_c) < 0)) {
      newErrors.decimal_field_c = "Please enter a valid decimal value"
    }

    // Email validation
    if (formData.email_field_c) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email_field_c)) {
        newErrors.email_field_c = "Please enter a valid email address"
      }
    }

    // Phone validation
    if (formData.phone_field_c) {
      const phoneRegex = /^\+?[\d\s\-()]{10,}$/
      if (!phoneRegex.test(formData.phone_field_c)) {
        newErrors.phone_field_c = "Please enter a valid phone number"
      }
    }

    // Website validation
    if (formData.website_field_c) {
      try {
        new URL(formData.website_field_c)
      } catch {
        newErrors.website_field_c = "Please enter a valid website URL"
      }
    }

    // Range validation
    if (formData.range_field_c && (isNaN(formData.range_field_c) || parseInt(formData.range_field_c) < 1)) {
      newErrors.range_field_c = "Please enter a valid range value"
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
        decimal_field_c: parseFloat(formData.decimal_field_c) || null,
        multi_picklist_field_c: formData.multi_picklist_field_c,
        range_field_c: parseInt(formData.range_field_c) || 1,
        boolean_field_c: formData.boolean_field_c,
        email_field_c: formData.email_field_c.trim(),
        checkbox_field_c: formData.checkbox_field_c,
        radio_field_c: formData.radio_field_c,
        phone_field_c: formData.phone_field_c.trim(),
        website_field_c: formData.website_field_c.trim(),
        goal_term_c: formData.goal_term_c,
        completion_rate_c: parseFloat(formData.completion_rate_c) / 100 || 0
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

<FormField label="Interest/Growth Rate (%)" error={errors.decimal_field_c}>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          placeholder="e.g., 2.5"
          value={formData.decimal_field_c}
          onChange={(e) => handleChange("decimal_field_c", e.target.value)}
        />
      </FormField>

<FormField label="Goal Categories" error={errors.multi_picklist_field_c}>
        <select
          multiple
          className="flex min-h-20 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          value={formData.multi_picklist_field_c.split(',')}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            handleChange("multi_picklist_field_c", values.join(','));
          }}
        >
          <option value="Option1">Emergency Fund</option>
          <option value="Option2">Vacation</option>
          <option value="Option3">Education</option>
        </select>
        <div className="text-xs text-gray-500 mt-1">
          Hold Ctrl/Cmd to select multiple options
        </div>
      </FormField>

<FormField label="Priority Level" error={errors.range_field_c}>
        <Input
          type="number"
          min="1"
          max="10"
          placeholder="Enter priority level (1-10)"
          value={formData.range_field_c}
          onChange={(e) => handleChange("range_field_c", e.target.value)}
        />
      </FormField>

<FormField label="Goal Status" error={errors.boolean_field_c}>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.boolean_field_c}
            onChange={(e) => handleChange("boolean_field_c", e.target.checked)}
            className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">
            Goal is active
          </label>
        </div>
      </FormField>

<FormField label="Contact Email" error={errors.email_field_c}>
        <Input
          type="email"
          placeholder="your@email.com"
          value={formData.email_field_c}
          onChange={(e) => handleChange("email_field_c", e.target.value)}
        />
      </FormField>

<FormField label="Goal Features" error={errors.checkbox_field_c}>
        <div className="space-y-2">
          {["Auto-save", "Progress tracking", "Milestone alerts", "Visual charts"].map(feature => (
            <div key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`feature-${feature}`}
                checked={formData.checkbox_field_c.split(',').includes(feature)}
                onChange={(e) => {
                  const currentFeatures = formData.checkbox_field_c ? formData.checkbox_field_c.split(',').filter(f => f) : []
                  if (e.target.checked) {
                    handleChange("checkbox_field_c", [...currentFeatures, feature].join(','))
                  } else {
                    handleChange("checkbox_field_c", currentFeatures.filter(f => f !== feature).join(','))
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

      <FormField label="Completion Rate (%)" error={errors.completion_rate_c}>
        <Input
          type="number"
          min="0"
          max="100"
          step="1"
          placeholder="0"
          value={formData.completion_rate_c}
          onChange={(e) => handleChange("completion_rate_c", e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-1">
          Enter completion percentage (0-100%)
        </div>
      </FormField>

<FormField label="Goal Type" error={errors.radio_field_c}>
        <div className="space-y-2">
          {[
            { value: "Option1", label: "Personal Goal" },
            { value: "Option2", label: "Family Goal" },
            { value: "Option3", label: "Business Goal" }
          ].map(type => (
            <div key={type.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`type-${type.value}`}
                name="goal_type"
                value={type.value}
                checked={formData.radio_field_c === type.value}
                onChange={(e) => handleChange("radio_field_c", e.target.value)}
                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 focus:ring-primary-500"
              />
              <label htmlFor={`type-${type.value}`} className="text-sm text-gray-700">
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </FormField>

<FormField label="Contact Phone" error={errors.phone_field_c}>
        <Input
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone_field_c}
          onChange={(e) => handleChange("phone_field_c", e.target.value)}
        />
      </FormField>

<FormField label="Reference Website" error={errors.website_field_c}>
        <Input
          type="url"
          placeholder="https://example.com"
          value={formData.website_field_c}
          onChange={(e) => handleChange("website_field_c", e.target.value)}
        />
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