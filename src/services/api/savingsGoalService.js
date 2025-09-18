import { toast } from "react-toastify";
import React from "react";

export const savingsGoalService = {
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
          { field: { Name: "title_c" }},
          { field: { Name: "target_amount_c" }},
          { field: { Name: "current_amount_c" }},
          { field: { Name: "target_date_c" }},
          { field: { Name: "notes_c" }},
          { field: { Name: "created_at_c" }},
          { field: { Name: "decimal_rate_c" }},
          { field: { Name: "categories_c" }},
          { field: { Name: "priority_range_c" }},
          { field: { Name: "is_active_c" }},
          { field: { Name: "contact_email_c" }},
          { field: { Name: "goal_tags_c" }},
          { field: { Name: "reminder_datetime_c" }},
          { field: { Name: "features_c" }},
          { field: { Name: "goal_type_c" }},
          { field: { Name: "contact_phone_c" }},
          { field: { Name: "reference_url_c" }},
          { field: { Name: "importance_rating_c" }}
        ],
        orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
      }

      const response = await apperClient.fetchRecords('savings_goal_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching savings goals:", error?.response?.data?.message || error)
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
          { field: { Name: "title_c" }},
          { field: { Name: "target_amount_c" }},
          { field: { Name: "current_amount_c" }},
          { field: { Name: "target_date_c" }},
          { field: { Name: "notes_c" }},
          { field: { Name: "created_at_c" }},
          { field: { Name: "decimal_rate_c" }},
          { field: { Name: "categories_c" }},
          { field: { Name: "priority_range_c" }},
          { field: { Name: "is_active_c" }},
          { field: { Name: "contact_email_c" }},
          { field: { Name: "goal_tags_c" }},
          { field: { Name: "reminder_datetime_c" }},
          { field: { Name: "features_c" }},
          { field: { Name: "goal_type_c" }},
          { field: { Name: "contact_phone_c" }},
          { field: { Name: "reference_url_c" }},
          { field: { Name: "importance_rating_c" }}
        ]
      }

      const response = await apperClient.getRecordById('savings_goal_c', parseInt(id), params)
      return response.data
    } catch (error) {
      console.error(`Error fetching savings goal ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  create: async (goalData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
Name: goalData.title_c,
          title_c: goalData.title_c,
          target_amount_c: goalData.target_amount_c,
          current_amount_c: goalData.current_amount_c || 0,
          target_date_c: goalData.target_date_c,
          notes_c: goalData.notes_c,
          created_at_c: new Date().toISOString(),
          decimal_rate_c: goalData.decimal_rate_c,
          categories_c: goalData.categories_c,
          priority_range_c: goalData.priority_range_c,
          is_active_c: goalData.is_active_c,
          contact_email_c: goalData.contact_email_c,
          goal_tags_c: goalData.goal_tags_c,
          reminder_datetime_c: goalData.reminder_datetime_c,
          features_c: goalData.features_c,
          goal_type_c: goalData.goal_type_c,
          contact_phone_c: goalData.contact_phone_c,
          reference_url_c: goalData.reference_url_c,
          importance_rating_c: goalData.importance_rating_c
        }]
      }

      const response = await apperClient.createRecord('savings_goal_c', params)

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
      console.error("Error creating savings goal:", error?.response?.data?.message || error)
      return null
    }
  },

  update: async (id, goalData) => {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
Name: goalData.title_c,
          title_c: goalData.title_c,
          target_amount_c: goalData.target_amount_c,
          current_amount_c: goalData.current_amount_c,
          target_date_c: goalData.target_date_c,
          notes_c: goalData.notes_c,
          decimal_rate_c: goalData.decimal_rate_c,
          categories_c: goalData.categories_c,
          priority_range_c: goalData.priority_range_c,
          is_active_c: goalData.is_active_c,
          contact_email_c: goalData.contact_email_c,
          goal_tags_c: goalData.goal_tags_c,
          reminder_datetime_c: goalData.reminder_datetime_c,
          features_c: goalData.features_c,
          goal_type_c: goalData.goal_type_c,
          contact_phone_c: goalData.contact_phone_c,
          reference_url_c: goalData.reference_url_c,
          importance_rating_c: goalData.importance_rating_c
        }]
      }

      const response = await apperClient.updateRecord('savings_goal_c', params)

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
      console.error("Error updating savings goal:", error?.response?.data?.message || error)
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

      const response = await apperClient.deleteRecord('savings_goal_c', params)

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
      console.error("Error deleting savings goal:", error?.response?.data?.message || error)
return false
    }
  }
}