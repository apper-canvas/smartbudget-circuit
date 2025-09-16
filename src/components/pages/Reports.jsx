import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import SpendingChart from "@/components/organisms/SpendingChart"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { transactionService } from "@/services/api/transactionService"
import { formatCurrency, getCurrentMonth, getMonthName } from "@/utils/formatters"

const Reports = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth().month)
  const [selectedYear, setSelectedYear] = useState(getCurrentMonth().year)
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    setLoading(true)
    setError("")
    
    try {
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch (err) {
      setError("Failed to load transaction data")
      console.error("Reports data loading error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter transactions based on selected criteria
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    const matchesMonth = transactionDate.getMonth() + 1 === selectedMonth
    const matchesYear = transactionDate.getFullYear() === selectedYear
    const matchesCategory = !selectedCategory || transaction.category === selectedCategory
    
    return matchesMonth && matchesYear && matchesCategory
  })

  // Get unique categories
  const categories = [...new Set(transactions.map(t => t.category))].sort()

  // Calculate summary statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const netIncome = totalIncome - totalExpenses
  
  // Category breakdown for expenses
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const categoryBreakdown = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      count: filteredTransactions.filter(t => t.category === category && t.type === "expense").length
    }))
    .sort((a, b) => b.amount - a.amount)

  // Monthly trends (last 6 months)
  const getMonthlyTrends = () => {
    const trends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(selectedYear, selectedMonth - 1 - i, 1)
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const monthName = getMonthName(month)
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date)
        return tDate.getMonth() + 1 === month && tDate.getFullYear() === year
      })
      
      const income = monthTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
      const expenses = monthTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
      
      trends.push({
        month: monthName,
        year,
        income,
        expenses,
        net: income - expenses
      })
    }
    return trends
  }

  const monthlyTrends = getMonthlyTrends()

  // Generate options
  const generateMonthOptions = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    return months.map((month, index) => (
      <option key={index + 1} value={index + 1}>{month}</option>
    ))
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
      years.push(i)
    }
    return years.map(year => (
      <option key={year} value={year}>{year}</option>
    ))
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTransactions} />

  if (transactions.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Analyze your financial patterns and trends</p>
          </div>
        </div>
        
        <Empty 
          title="No transaction data"
          description="Add some transactions to see detailed reports and insights about your financial patterns."
          actionLabel="Go to Dashboard"
          icon="BarChart3"
          onAction={() => window.location.href = "/"}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze your financial patterns and trends</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Month:</label>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {generateMonthOptions()}
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Year:</label>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {generateYearOptions()}
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              Viewing {getMonthName(selectedMonth)} {selectedYear}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50 mr-4">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-50 mr-4">
                <ApperIcon name="TrendingDown" className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg mr-4 ${netIncome >= 0 ? 'bg-blue-50' : 'bg-amber-50'}`}>
                <ApperIcon 
                  name={netIncome >= 0 ? "ArrowUp" : "ArrowDown"} 
                  className={`w-6 h-6 ${netIncome >= 0 ? 'text-blue-600' : 'text-amber-600'}`} 
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                  {formatCurrency(netIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={filteredTransactions} type="pie" />
        
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>6-Month Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">
                      {trend.month} {trend.year}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-green-600">
                      +{formatCurrency(trend.income)}
                    </div>
                    <div className="text-red-600">
                      -{formatCurrency(trend.expenses)}
                    </div>
                    <div className={`font-semibold ${trend.net >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                      {formatCurrency(trend.net)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="default">{item.category}</Badge>
                  <span className="text-sm text-gray-600">{item.count} transactions</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(item.amount)}</div>
                    <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reports