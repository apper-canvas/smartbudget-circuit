import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency, formatPercent } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const BudgetProgress = ({ budgets, transactions, currentMonth, currentYear }) => {
  // Calculate spent amounts for each budget category
const budgetProgress = budgets.map(budget => {
    const categoryExpenses = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      const budgetCategory = budget.category_c?.Name || budget.category_c
      return (
        transaction.type === "expense" &&
        transaction.category === budgetCategory &&
        transactionDate.getMonth() + 1 === currentMonth &&
        transactionDate.getFullYear() === currentYear
      )
    })
    
    const spent = categoryExpenses.reduce((sum, transaction) => sum + transaction.amount, 0)
    const monthlyLimit = budget.monthly_limit_c
    const percentage = monthlyLimit > 0 ? (spent / monthlyLimit) * 100 : 0
    const remaining = monthlyLimit - spent
    
    return {
      ...budget,
      spent,
      percentage: Math.min(percentage, 100),
      remaining: Math.max(remaining, 0),
      isOverBudget: spent > monthlyLimit
    }
  })

  const getProgressColor = (percentage, isOverBudget) => {
    if (isOverBudget) return "bg-red-500"
    if (percentage >= 80) return "bg-amber-500"
    return "bg-primary-500"
  }

  const getStatusIcon = (percentage, isOverBudget) => {
    if (isOverBudget) return "AlertTriangle"
    if (percentage >= 80) return "AlertCircle"
    return "CheckCircle"
  }

  const getStatusColor = (percentage, isOverBudget) => {
    if (isOverBudget) return "text-red-600"
    if (percentage >= 80) return "text-amber-600"
    return "text-green-600"
  }

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <ApperIcon name="Target" className="w-8 h-8 mb-2" />
            <p className="text-sm">No budgets set for this month</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="Target" className="w-5 h-5 mr-2" />
          Budget Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {budgetProgress.map((budget) => (
            <div key={budget.Id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
<h4 className="font-medium text-gray-900">{budget.category_c?.Name || budget.category_c}</h4>
                  <ApperIcon 
                    name={getStatusIcon(budget.percentage, budget.isOverBudget)}
                    className={cn("w-4 h-4", getStatusColor(budget.percentage, budget.isOverBudget))}
                  />
                </div>
                <div className="text-right">
<p className="text-sm font-medium text-gray-900">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.monthly_limit_c)}
                  </p>
                  <p className={cn(
                    "text-xs",
                    budget.isOverBudget ? "text-red-600" : "text-gray-500"
                  )}>
{budget.isOverBudget 
                      ? `${formatCurrency(Math.abs(budget.remaining))} over budget`
                      : `${formatCurrency(budget.remaining)} remaining`
                    }
                  </p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
<span>{formatPercent(budget.percentage)} used</span>
                  {budget.isOverBudget && (
                    <span className="text-red-600 font-medium">Over Budget!</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300 rounded-full",
                      getProgressColor(budget.percentage, budget.isOverBudget)
                    )}
style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                  {budget.isOverBudget && (
                    <div
                      className="h-full bg-red-300 transition-all duration-300"
                      style={{ width: `${Math.min(budget.percentage - 100, 20)}%` }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default BudgetProgress