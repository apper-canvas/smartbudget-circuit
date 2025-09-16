import categoryData from "@/services/mockData/categories.json"

// Service implementation with realistic delays
export const categoryService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 250))
    return [...categoryData]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const category = categoryData.find(item => item.Id === parseInt(id))
    if (!category) {
      throw new Error(`Category with Id ${id} not found`)
    }
    return { ...category }
  },

  getByType: async (type) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    return categoryData.filter(item => item.type === type)
  }
}