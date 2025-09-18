import { toast } from 'react-toastify'

export const budgetService = {
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
          { field: { Name: "category_c" }},
          { field: { Name: "monthly_limit_c" }},
          { field: { Name: "month_c" }},
          { field: { Name: "year_c" }},
          { field: { Name: "created_at_c" }}
        ]
      }

      const response = await apperClient.fetchRecords('budget_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error)
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
          { field: { Name: "category_c" }},
          { field: { Name: "monthly_limit_c" }},
          { field: { Name: "month_c" }},
          { field: { Name: "year_c" }},
          { field: { Name: "created_at_c" }}
        ]
      }

      const response = await apperClient.getRecordById('budget_c', parseInt(id), params)
      return response.data
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  create: async (formData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: `Budget for ${formData.month_c}/${formData.year_c}`,
          category_c: formData.category_c,
          monthly_limit_c: formData.monthly_limit_c,
          month_c: formData.month_c,
          year_c: formData.year_c,
          created_at_c: new Date().toISOString()
        }]
      }

      const response = await apperClient.createRecord('budget_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error)
      return null
    }
  },

  update: async (id, updateData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `Budget for ${updateData.month_c}/${updateData.year_c}`,
          category_c: updateData.category_c,
          monthly_limit_c: updateData.monthly_limit_c,
          month_c: updateData.month_c,
          year_c: updateData.year_c
        }]
      }

      const response = await apperClient.updateRecord('budget_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        return successful.length > 0 ? successful[0].data : null
      }
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error)
      return null
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('budget_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        return response.results.filter(r => r.success).length > 0
      }
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error)
      return false
    }
  }
}