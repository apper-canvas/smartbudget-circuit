import transactionData from "@/services/mockData/transactions.json"

// Service implementation with realistic delays
export const transactionService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...transactionData].sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const transaction = transactionData.find(item => item.Id === parseInt(id))
    if (!transaction) {
      throw new Error(`Transaction with Id ${id} not found`)
    }
    return { ...transaction }
  },

  create: async (transactionData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const maxId = Math.max(...transactionData.map(item => item.Id), 0)
    const newTransaction = {
      Id: maxId + 1,
      type: transactionData.type,
      amount: transactionData.amount,
      category: transactionData.category,
      description: transactionData.description,
      date: transactionData.date,
      createdAt: new Date().toISOString()
    }
    transactionData.unshift(newTransaction)
    return { ...newTransaction }
  },

  update: async (id, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = transactionData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Transaction with Id ${id} not found`)
    }
    const updatedTransaction = {
      ...transactionData[index],
      ...updateData,
      Id: parseInt(id)
    }
    transactionData[index] = updatedTransaction
    return { ...updatedTransaction }
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = transactionData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Transaction with Id ${id} not found`)
    }
    const deletedTransaction = transactionData.splice(index, 1)[0]
    return { ...deletedTransaction }
  }
}