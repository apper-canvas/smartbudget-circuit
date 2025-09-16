import savingsGoalData from "@/services/mockData/savingsGoals.json"

// Mock service implementation with realistic delays
let mockData = [...savingsGoalData]

export const savingsGoalService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...mockData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const goal = mockData.find(item => item.Id === parseInt(id))
    if (!goal) {
      throw new Error(`Savings goal with Id ${id} not found`)
    }
    return { ...goal }
  },

  create: async (goalData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newGoal = {
      Id: Math.max(...mockData.map(g => g.Id), 0) + 1,
      ...goalData,
      currentAmount: goalData.currentAmount || 0,
      createdAt: new Date().toISOString()
    }
    mockData.push(newGoal)
    return { ...newGoal }
  },

  update: async (id, goalData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Savings goal with Id ${id} not found`)
    }
    
    mockData[index] = {
      ...mockData[index],
      ...goalData,
      Id: parseInt(id) // Preserve the ID
    }
    return { ...mockData[index] }
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Savings goal with Id ${id} not found`)
    }
    
    mockData.splice(index, 1)
    return true
  }
}