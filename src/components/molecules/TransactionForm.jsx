import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { categoryService } from "@/services/api/categoryService"
import { formatDate } from "@/utils/formatters"

const TransactionForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
type_c: "expense",
    amount_c: "",
    category_c: "",
    description_c: "",
    date_c: new Date().toISOString().split("T")[0]
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
loadCategories()
    if (initialData) {
      setFormData({
        type_c: initialData.type_c || "expense",
        amount_c: initialData.amount_c?.toString() || "",
        category_c: initialData.category_c?.Id || initialData.category_c || "",
        description_c: initialData.description_c || "",
        date_c: initialData.date_c ? new Date(initialData.date_c).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
      })
    }
  }, [initialData])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
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
    
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Please enter a description"
    }
    
    if (!formData.date) {
      newErrors.date = "Please select a date"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
const transaction = {
        type_c: formData.type_c,
        amount_c: parseFloat(formData.amount_c),
        category_c: parseInt(formData.category_c),
        description_c: formData.description_c.trim(),
        date_c: formData.date_c
      }
      
      await onSubmit(transaction)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(cat => cat.type === formData.type)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Type" required>
          <Select 
            value={formData.type} 
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </FormField>
        
        <FormField label="Amount" required error={errors.amount}>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
          />
        </FormField>
      </div>
      
      <FormField label="Category" required error={errors.category}>
        <Select 
          value={formData.category} 
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">Select a category</option>
{filteredCategories.map(category => (
            <option key={category.Id} value={category.Id}>
              {category.Name}
            </option>
          ))}
        </Select>
      </FormField>
      
      <FormField label="Description" required error={errors.description}>
        <Input
          placeholder="Enter transaction description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </FormField>
      
      <FormField label="Date" required error={errors.date}>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
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
              {initialData ? "Update" : "Add"} Transaction
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

export default TransactionForm