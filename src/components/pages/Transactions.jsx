import React, { useState, useEffect } from "react"
import TransactionTable from "@/components/organisms/TransactionTable"
import Button from "@/components/atoms/Button"
import Modal from "@/components/molecules/Modal"
import TransactionForm from "@/components/molecules/TransactionForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { transactionService } from "@/services/api/transactionService"
import { toast } from "react-toastify"

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

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
      setError("Failed to load transactions")
      console.error("Transactions loading error:", err)
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

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setShowEditModal(true)
  }

  const handleUpdateTransaction = async (transactionData) => {
    try {
      const updatedTransaction = await transactionService.update(editingTransaction.Id, transactionData)
      setTransactions(prev => prev.map(t => 
        t.Id === editingTransaction.Id ? updatedTransaction : t
      ))
      setShowEditModal(false)
      setEditingTransaction(null)
      toast.success("Transaction updated successfully!")
    } catch (error) {
      toast.error("Failed to update transaction")
      console.error("Update transaction error:", error)
    }
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

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTransactions} />

  if (transactions.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">Manage all your financial transactions</p>
          </div>
        </div>
        
        <Empty 
          title="No transactions yet"
          description="Start tracking your finances by adding your first income or expense transaction."
          actionLabel="Add First Transaction"
          icon="Receipt"
          onAction={() => setShowAddModal(true)}
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Manage all your financial transactions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button onClick={() => setShowAddModal(true)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        showFilters={true}
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

      {/* Edit Transaction Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingTransaction(null)
        }}
        title="Edit Transaction"
        size="md"
      >
        <TransactionForm
          initialData={editingTransaction}
          onSubmit={handleUpdateTransaction}
          onCancel={() => {
            setShowEditModal(false)
            setEditingTransaction(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Transactions