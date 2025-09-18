import React, { useEffect, useState } from "react";
import { categoryService } from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import { formatDate } from "@/utils/formatters";

const TransactionForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
type_c: "expense",
    amount_c: "",
    category_c: "",
    description_c: "",
    date_c: new Date().toISOString().split("T")[0],
    range_c: "",
    Tags: "",
    datetime_c: ""
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
        date_c: initialData.date_c ? new Date(initialData.date_c).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        range_c: initialData.range_c?.toString() || "",
        Tags: initialData.Tags || "",
        datetime_c: initialData.datetime_c ? new Date(initialData.datetime_c).toISOString().slice(0, 16) : ""
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
    
if (!formData.amount_c || isNaN(formData.amount_c) || parseFloat(formData.amount_c) <= 0) {
      newErrors.amount_c = "Please enter a valid amount"
    }
    
    if (!formData.category_c) {
      newErrors.category_c = "Please select a category"
    }
    
    if (!formData.description_c.trim()) {
      newErrors.description_c = "Please enter a description"
    }
    
    if (!formData.date_c) {
      newErrors.date_c = "Please select a date"
    }
    
    if (formData.range_c && (isNaN(formData.range_c) || parseFloat(formData.range_c) < 0)) {
      newErrors.range_c = "Please enter a valid range value"
    }
    
    if (formData.datetime_c && isNaN(new Date(formData.datetime_c).getTime())) {
      newErrors.datetime_c = "Please enter a valid date and time"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
try {
      const transactionData = {
        ...formData,
        amount_c: Number(formData.amount_c) || 0,
category_c: formData.category_c ? parseInt(formData.category_c) : null,
        range_c: formData.range_c ? parseFloat(formData.range_c) : null,
        Tags: formData.Tags.trim(),
        datetime_c: formData.datetime_c ? new Date(formData.datetime_c).toISOString() : null
      }
      await onSubmit(transactionData)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setLoading(false)
    }
  }

const filteredCategories = categories.filter(cat => cat.type_c === formData.type_c)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Type" required>
<Select 
            value={formData.type_c} 
            onChange={(e) => handleChange("type_c", e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </FormField>
        
<FormField label="Amount" required error={errors.amount_c}>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount_c}
            onChange={(e) => handleChange("amount_c", e.target.value)}
          />
        </FormField>
      </div>
      
      <FormField label="Category" required error={errors.category_c}>
<Select 
          value={formData.category_c} 
          onChange={(e) => handleChange("category_c", e.target.value)}
        >
          <option value="">Select a category</option>
{filteredCategories.map(category => (
            <option key={category.Id} value={category.Id}>
              {category.Name}
            </option>
          ))}
        </Select>
      </FormField>
      
<FormField label="Description" required error={errors.description_c}>
        <Input
          placeholder="Enter transaction description"
          value={formData.description_c}
          onChange={(e) => handleChange("description_c", e.target.value)}
        />
      </FormField>
      
      <FormField label="Date" required error={errors.date_c}>
        <Input
          type="date"
          value={formData.date_c}
          onChange={(e) => handleChange("date_c", e.target.value)}
        />
      </FormField>
      
      <FormField label="Range Value" error={errors.range_c}>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter range value"
          value={formData.range_c}
          onChange={(e) => handleChange("range_c", e.target.value)}
        />
      </FormField>
      
      <FormField label="Tags" error={errors.Tags}>
        <Input
          type="text"
          placeholder="e.g., urgent,monthly,groceries"
          value={formData.Tags}
          onChange={(e) => handleChange("Tags", e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-1">
          Separate multiple tags with commas
        </div>
      </FormField>
      
<FormField label="Date & Time" error={errors.datetime_c}>
        <Input
          type="datetime-local"
          value={formData.datetime_c}
          onChange={(e) => handleChange("datetime_c", e.target.value)}
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