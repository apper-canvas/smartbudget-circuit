import { toast } from 'react-toastify'


export const categoryService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
{ field: { Name: "Id" }},
          { field: { Name: "Name" }},
          { field: { Name: "type_c" }},
          { field: { Name: "icon_c" }},
          { field: { Name: "color_c" }}
        ]
      }

      const response = await apperClient.fetchRecords('category_c', params)

if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      // If database is empty, provide default categories
      if (!response.data || response.data.length === 0) {
        return [
          { Id: 1, Name: "Transportation", type_c: "expense", icon_c: "Car", color_c: "#3b82f6" },
          { Id: 2, Name: "Food & Dining", type_c: "expense", icon_c: "UtensilsCrossed", color_c: "#ef4444" },
          { Id: 3, Name: "Groceries", type_c: "expense", icon_c: "ShoppingCart", color_c: "#22c55e" },
          { Id: 4, Name: "Entertainment", type_c: "expense", icon_c: "Film", color_c: "#a855f7" },
          { Id: 5, Name: "Medical & Healthcare", type_c: "expense", icon_c: "Heart", color_c: "#ec4899" },
          { Id: 6, Name: "Shopping", type_c: "expense", icon_c: "ShoppingBag", color_c: "#f59e0b" },
          { Id: 7, Name: "Utilities", type_c: "expense", icon_c: "Zap", color_c: "#eab308" },
          { Id: 8, Name: "Travel", type_c: "expense", icon_c: "Plane", color_c: "#06b6d4" },
          { Id: 9, Name: "Education", type_c: "expense", icon_c: "GraduationCap", color_c: "#8b5cf6" },
          { Id: 10, Name: "Personal Care", type_c: "expense", icon_c: "User", color_c: "#f97316" },
          { Id: 11, Name: "Home & Garden", type_c: "expense", icon_c: "Home", color_c: "#84cc16" },
          { Id: 12, Name: "Insurance", type_c: "expense", icon_c: "Shield", color_c: "#64748b" },
          { Id: 13, Name: "Salary", type_c: "income", icon_c: "DollarSign", color_c: "#22c55e" },
          { Id: 14, Name: "Freelance", type_c: "income", icon_c: "Briefcase", color_c: "#3b82f6" },
          { Id: 15, Name: "Investment", type_c: "income", icon_c: "TrendingUp", color_c: "#10b981" }
        ]
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error)
      return []
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
{ field: { Name: "Id" }},
          { field: { Name: "Name" }},
          { field: { Name: "type_c" }},
          { field: { Name: "icon_c" }},
          { field: { Name: "color_c" }}
        ]
      }

      const response = await apperClient.getRecordById('category_c', parseInt(id), params)
      return response.data
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  getByType: async (type) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
fields: [
          { field: { Name: "Id" }},
          { field: { Name: "Name" }},
          { field: { Name: "type_c" }},
          { field: { Name: "icon_c" }},
          { field: { Name: "color_c" }}
        ],
        where: [{ FieldName: "type_c", Operator: "EqualTo", Values: [type] }]
      }

      const response = await apperClient.fetchRecords('category_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching categories by type:", error?.response?.data?.message || error)
      return []
    }
  }
}