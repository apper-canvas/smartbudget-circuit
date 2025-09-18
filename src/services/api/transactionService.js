import { toast } from "react-toastify";
import React from "react";

// Service implementation with ApperClient
export const transactionService = {
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
          { field: { Name: "amount_c" }},
          { field: { Name: "description_c" }},
          { field: { Name: "date_c" }},
          { field: { Name: "category_c" }},
          { field: { Name: "range_c" }},
          { field: { Name: "Tags" }},
          { field: { Name: "datetime_c" }}
        ],
        orderBy: [{ fieldName: "date_c", sorttype: "DESC" }]
      }

      const response = await apperClient.fetchRecords('transaction_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching transactions:", error?.response?.data?.message || error)
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
          { field: { Name: "amount_c" }},
          { field: { Name: "description_c" }},
          { field: { Name: "date_c" }},
          { field: { Name: "category_c" }},
          { field: { Name: "range_c" }},
          { field: { Name: "Tags" }},
          { field: { Name: "datetime_c" }}
        ]
      }

      const response = await apperClient.getRecordById('transaction_c', parseInt(id), params)
      return response.data
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  create: async (newTransactionData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Name: `${newTransactionData.type_c} - ${newTransactionData.description_c}`,
type_c: newTransactionData.type_c,
          amount_c: newTransactionData.amount_c,
          description_c: newTransactionData.description_c,
          date_c: newTransactionData.date_c,
          category_c: newTransactionData.category_c,
          range_c: newTransactionData.range_c,
          Tags: newTransactionData.Tags,
          datetime_c: newTransactionData.datetime_c,
          created_at_c: new Date().toISOString()
        }]
      }

      const response = await apperClient.createRecord('transaction_c', params)

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
      console.error("Error creating transaction:", error?.response?.data?.message || error)
      return null
    }
  },

  update: async (id, transactionUpdateData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${transactionUpdateData.type_c} - ${transactionUpdateData.description_c}`,
type_c: transactionUpdateData.type_c,
          amount_c: transactionUpdateData.amount_c,
          description_c: transactionUpdateData.description_c,
          date_c: transactionUpdateData.date_c,
          category_c: transactionUpdateData.category_c,
          range_c: transactionUpdateData.range_c,
          Tags: transactionUpdateData.Tags,
          datetime_c: transactionUpdateData.datetime_c
        }]
      }

      const response = await apperClient.updateRecord('transaction_c', params)

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
      console.error("Error updating transaction:", error?.response?.data?.message || error)
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

      const response = await apperClient.deleteRecord('transaction_c', params)

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
      console.error("Error deleting transaction:", error?.response?.data?.message || error)
      return false
}
  }
}