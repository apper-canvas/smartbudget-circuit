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

create: async (budgetData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = Math.max(...budgetData.map(item => item.Id), 0)
    const newBudget = {
      Id: maxId + 1,
      category: budgetData.category,
      monthlyLimit: budgetData.monthlyLimit,
      month: budgetData.month,
      year: budgetData.year,
      createdAt: new Date().toISOString()
    }
    budgetData.push(newBudget)
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