import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { categoryService } from "@/services/api/categoryService"
import { getCurrentMonth } from "@/utils/formatters"

const BudgetForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    category: "",
category_c: "",
    monthly_limit_c: "",
    month_c: getCurrentMonth().month,
    year_c: getCurrentMonth().year
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
loadCategories()
    if (initialData) {
      setFormData({
        category_c: initialData.category_c?.Id || initialData.category_c || "",
        monthly_limit_c: initialData.monthly_limit_c?.toString() || "",
        month_c: initialData.month_c || getCurrentMonth().month,
        year_c: initialData.year_c || getCurrentMonth().year
      })
    }
  }, [initialData])

  const loadCategories = async () => {
try {
      const data = await categoryService.getAll()
      const expenseCategories = data.filter(cat => cat.type_c === "expense")
      setCategories(expenseCategories)
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    
    if (!formData.monthlyLimit || isNaN(formData.monthlyLimit) || parseFloat(formData.monthlyLimit) <= 0) {
      newErrors.monthlyLimit = "Please enter a valid budget amount"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      const budget = {
category_c: parseInt(formData.category_c),
        monthly_limit_c: parseFloat(formData.monthly_limit_c),
        month_c: parseInt(formData.month_c),
        year_c: parseInt(formData.year_c)
      }
      await onSubmit(budget)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateMonthOptions = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    return months.map((month, index) => (
      <option key={index + 1} value={index + 1}>{month}</option>
    ))
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 1; i <= currentYear + 2; i++) {
      years.push(i)
    }
    return years.map(year => (
      <option key={year} value={year}>{year}</option>
    ))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Category" required error={errors.category}>
        <Select 
          value={formData.category} 
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">Select a category</option>
{categories.map(category => (
            <option key={category.Id} value={category.Id}>
              {category.Name}
            </option>
          ))}
        </Select>
      </FormField>
      
      <FormField label="Monthly Budget Limit" required error={errors.monthlyLimit}>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.monthlyLimit}
          onChange={(e) => handleChange("monthlyLimit", e.target.value)}
        />
      </FormField>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Month" required>
          <Select 
            value={formData.month} 
            onChange={(e) => handleChange("month", parseInt(e.target.value))}
          >
            {generateMonthOptions()}
          </Select>
        </FormField>
        
        <FormField label="Year" required>
          <Select 
            value={formData.year} 
            onChange={(e) => handleChange("year", parseInt(e.target.value))}
          >
            {generateYearOptions()}
          </Select>
        </FormField>
      </div>
      
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
              {initialData ? "Update" : "Set"} Budget
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

export default BudgetForm