import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import Modal from "@/components/molecules/Modal"
import BudgetForm from "@/components/molecules/BudgetForm"
import BudgetProgress from "@/components/organisms/BudgetProgress"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import { budgetService } from "@/services/api/budgetService"
import { transactionService } from "@/services/api/transactionService"
import { formatCurrency, getCurrentMonth, getMonthName } from "@/utils/formatters"
import { toast } from "react-toastify"

const Budget = () => {
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth().month)
  const [selectedYear, setSelectedYear] = useState(getCurrentMonth().year)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [budgetData, transactionData] = await Promise.all([
        budgetService.getAll(),
        transactionService.getAll()
      ])
      
      setBudgets(budgetData)
      setTransactions(transactionData)
    } catch (err) {
      setError("Failed to load budget data")
      console.error("Budget data loading error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBudget = async (budgetData) => {
    try {
      const newBudget = await budgetService.create(budgetData)
      setBudgets(prev => [...prev, newBudget])
      setShowAddModal(false)
      toast.success("Budget created successfully!")
    } catch (error) {
      toast.error("Failed to create budget")
      console.error("Add budget error:", error)
    }
  }

  const handleEditBudget = (budget) => {
    setEditingBudget(budget)
    setShowEditModal(true)
  }

  const handleUpdateBudget = async (budgetData) => {
    try {
      const updatedBudget = await budgetService.update(editingBudget.Id, budgetData)
      setBudgets(prev => prev.map(b => 
        b.Id === editingBudget.Id ? updatedBudget : b
      ))
      setShowEditModal(false)
      setEditingBudget(null)
      toast.success("Budget updated successfully!")
    } catch (error) {
      toast.error("Failed to update budget")
      console.error("Update budget error:", error)
    }
  }

  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return
    
    try {
      await budgetService.delete(id)
      setBudgets(prev => prev.filter(b => b.Id !== id))
      toast.success("Budget deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete budget")
      console.error("Delete budget error:", error)
    }
  }

  // Filter budgets for selected month/year
const filteredBudgets = budgets.filter(b => 
    b.month_c === selectedMonth && b.year_c === selectedYear
  )

  // Generate month and year options
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
    for (let i = currentYear - 1; i <= currentYear + 2; i++) {
      years.push(i)
    }
    return years.map(year => (
      <option key={year} value={year}>{year}</option>
    ))
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
          <p className="text-gray-600">Set and track your monthly spending limits</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button onClick={() => setShowAddModal(true)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Set Budget
          </Button>
        </div>
      </div>

      {/* Month/Year Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Month:</label>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-32"
                >
                  {generateMonthOptions()}
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Year:</label>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-24"
                >
                  {generateYearOptions()}
                </Select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Viewing budgets for {getMonthName(selectedMonth)} {selectedYear}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredBudgets.length === 0 ? (
        <Empty 
          title="No budgets set"
          description={`You haven't set any budgets for ${getMonthName(selectedMonth)} ${selectedYear}. Start by creating your first budget to track your spending.`}
          actionLabel="Set First Budget"
          icon="Target"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <>
          {/* Budget Progress */}
          <BudgetProgress 
            budgets={filteredBudgets}
            transactions={transactions}
            currentMonth={selectedMonth}
            currentYear={selectedYear}
          />

          {/* Budget List */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Budget Limit</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Period</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBudgets.map((budget) => (
<tr key={budget.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
<div className="font-medium text-gray-900">{budget.category_c?.Name || budget.category_c}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
<span className="font-semibold text-primary-600">
                            {formatCurrency(budget.monthly_limit_c)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
<Badge variant="info">
                            {getMonthName(budget.month_c)} {budget.year_c}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditBudget(budget)}
                              className="h-8 w-8 p-0"
                            >
                              <ApperIcon name="Edit" className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBudget(budget.Id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add Budget Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Set Budget"
        size="md"
      >
        <BudgetForm
          onSubmit={handleAddBudget}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingBudget(null)
        }}
        title="Edit Budget"
        size="md"
      >
        <BudgetForm
          initialData={editingBudget}
          onSubmit={handleUpdateBudget}
          onCancel={() => {
            setShowEditModal(false)
            setEditingBudget(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Budget