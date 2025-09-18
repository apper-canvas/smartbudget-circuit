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