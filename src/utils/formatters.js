export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const formatPercent = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`
}

export const getCurrentMonth = () => {
  const now = new Date()
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    monthName: now.toLocaleDateString("en-US", { month: "long" }),
  }
}

export const getMonthName = (monthNumber) => {
  const date = new Date(2024, monthNumber - 1, 1)
  return date.toLocaleDateString("en-US", { month: "long" })
}