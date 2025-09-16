import budgetData from "@/services/mockData/budgets.json";
// Service implementation with realistic delays
export const budgetService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...budgetData]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const budget = budgetData.find(item => item.Id === parseInt(id))
    if (!budget) {
      throw new Error(`Budget with Id ${id} not found`)
    }
    return { ...budget }
  },

create: async (formData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    // Ensure budgetData is an array and get max ID safely
    const budgetArray = Array.isArray(budgetData) ? budgetData : []
    const maxId = budgetArray.length > 0 ? Math.max(...budgetArray.map(item => item.Id || item.id || 0), 0) : 0
    const newBudget = {
      Id: maxId + 1,
      category: formData.category,
      monthlyLimit: formData.monthlyLimit,
      month: formData.month,
      year: formData.year,
      createdAt: new Date().toISOString()
    }
    budgetArray.push(newBudget)
    return { ...newBudget }
  },

update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = budgetData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Budget with Id ${id} not found`)
    }
    const updatedBudget = {
      ...budgetData[index],
      ...updateData,
      Id: parseInt(id)
    }
    budgetData[index] = updatedBudget
    return { ...updatedBudget }
  },

delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = budgetData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Budget with Id ${id} not found`)
    }
    const deletedBudget = budgetData.splice(index, 1)[0]
    return { ...deletedBudget }
  }
}