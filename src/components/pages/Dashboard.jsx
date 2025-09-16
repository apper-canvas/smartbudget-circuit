import React, { useState, useEffect } from "react"
import StatCard from "@/components/molecules/StatCard"
import TransactionTable from "@/components/organisms/TransactionTable"
import SpendingChart from "@/components/organisms/SpendingChart"
import BudgetProgress from "@/components/organisms/BudgetProgress"
import Button from "@/components/atoms/Button"
import Modal from "@/components/molecules/Modal"
import TransactionForm from "@/components/molecules/TransactionForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { transactionService } from "@/services/api/transactionService"
import { budgetService } from "@/services/api/budgetService"
import { formatCurrency, getCurrentMonth } from "@/utils/formatters"
import { toast } from "react-toastify"

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const currentMonth = getCurrentMonth()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
      const [transactionData, budgetData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll()
      ])
      
      setTransactions(transactionData)
      setBudgets(budgetData)
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error("Dashboard data loading error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionService.create(transactionData)
      setTransactions(prev => [newTransaction, ...prev])
      setShowAddModal(false)
      toast.success("Transaction added successfully!")
    } catch (error) {
      toast.error("Failed to add transaction")
      console.error("Add transaction error:", error)
    }
  }

  const handleEditTransaction = async (transaction) => {
    // For now, just show a toast - full edit functionality would be in Transactions page
    toast.info("Edit functionality available in Transactions page")
  }

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return
    
    try {
      await transactionService.delete(id)
      setTransactions(prev => prev.filter(t => t.Id !== id))
      toast.success("Transaction deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete transaction")
      console.error("Delete transaction error:", error)
    }
  }

  // Calculate dashboard statistics
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date)
    return date.getMonth() + 1 === currentMonth.month && date.getFullYear() === currentMonth.year
  })

  const currentMonthIncome = currentMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const currentMonthExpenses = currentMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const netIncome = currentMonthIncome - currentMonthExpenses
  const totalBudget = budgets
    .filter(b => b.month === currentMonth.month && b.year === currentMonth.year)
    .reduce((sum, b) => sum + b.monthlyLimit, 0)

  const recentTransactions = transactions.slice(0, 5)

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  if (transactions.length === 0) {
    return (
      <Empty 
        title="Welcome to SmartBudget!"
        description="Start tracking your finances by adding your first transaction. Monitor your income, expenses, and budgets all in one place."
        actionLabel="Add First Transaction"
        icon="Wallet"
        onAction={() => setShowAddModal(true)}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">{currentMonth.monthName} {currentMonth.year} Overview</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button onClick={() => setShowAddModal(true)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="This Month's Income"
          value={formatCurrency(currentMonthIncome)}
          subtitle={`${currentMonthTransactions.filter(t => t.type === "income").length} transactions`}
          icon="TrendingUp"
          color="success"
        />
        <StatCard
          title="This Month's Expenses"
          value={formatCurrency(currentMonthExpenses)}
          subtitle={`${currentMonthTransactions.filter(t => t.type === "expense").length} transactions`}
          icon="TrendingDown"
          color="danger"
        />
        <StatCard
          title="Net Income"
          value={formatCurrency(netIncome)}
          subtitle={netIncome >= 0 ? "Positive cash flow" : "Negative cash flow"}
          icon={netIncome >= 0 ? "ArrowUp" : "ArrowDown"}
          color={netIncome >= 0 ? "success" : "danger"}
        />
        <StatCard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          subtitle={`${budgets.length} categories`}
          icon="Target"
          color="info"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={currentMonthTransactions} type="pie" />
        <BudgetProgress 
          budgets={budgets}
          transactions={transactions}
          currentMonth={currentMonth.month}
          currentYear={currentMonth.year}
        />
      </div>

      {/* Recent Transactions */}
      <TransactionTable
        transactions={recentTransactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        showFilters={false}
      />

      {/* Add Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Transaction"
        size="md"
      >
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  )
}

export default Dashboard