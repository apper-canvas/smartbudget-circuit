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

create: async (newTransactionData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Validate that transactionData is an array
    if (!Array.isArray(transactionData)) {
      throw new Error('Transaction data is not properly initialized as an array')
    }
    
    const maxId = Math.max(...transactionData.map(item => item.Id), 0)
    const newTransaction = {
      Id: maxId + 1,
      type: newTransactionData.type,
      amount: newTransactionData.amount,
      category: newTransactionData.category,
      description: newTransactionData.description,
      date: newTransactionData.date,
      createdAt: new Date().toISOString()
    }
    transactionData.unshift(newTransaction)
    return { ...newTransaction }
  },

update: async (id, transactionUpdateData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Validate that transactionData is an array
    if (!Array.isArray(transactionData)) {
      throw new Error('Transaction data is not properly initialized as an array')
    }
    
    const index = transactionData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Transaction with Id ${id} not found`)
    }
    const updatedTransaction = {
      ...transactionData[index],
      ...transactionUpdateData,
      Id: parseInt(id)
    }
    transactionData[index] = updatedTransaction
    return { ...updatedTransaction }
  },

delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Validate that transactionData is an array
    if (!Array.isArray(transactionData)) {
      throw new Error('Transaction data is not properly initialized as an array')
    }
    
    const index = transactionData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error(`Transaction with Id ${id} not found`)
    }
    const deletedTransaction = transactionData.splice(index, 1)[0]
    return { ...deletedTransaction }
  }
}