import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import Modal from "@/components/molecules/Modal"
import SavingsGoalForm from "@/components/molecules/SavingsGoalForm"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { savingsGoalService } from "@/services/api/savingsGoalService"
import { formatCurrency, formatDate } from "@/utils/formatters"

const SavingsGoals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await savingsGoalService.getAll()
      setGoals(data)
    } catch (err) {
      setError(err.message)
      console.error("Failed to load savings goals:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await savingsGoalService.create(goalData)
      setGoals(prev => [newGoal, ...prev])
      setIsFormOpen(false)
      toast.success("Savings goal created successfully!")
    } catch (err) {
      toast.error("Failed to create savings goal")
      throw err
    }
  }

  const handleEditGoal = async (goalData) => {
    try {
      const updatedGoal = await savingsGoalService.update(editingGoal.Id, goalData)
      setGoals(prev => prev.map(goal => 
        goal.Id === editingGoal.Id ? updatedGoal : goal
      ))
      setEditingGoal(null)
      setIsFormOpen(false)
      toast.success("Savings goal updated successfully!")
    } catch (err) {
      toast.error("Failed to update savings goal")
      throw err
    }
  }

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) {
      return
    }

    try {
      setDeletingId(id)
      await savingsGoalService.delete(id)
      setGoals(prev => prev.filter(goal => goal.Id !== id))
      toast.success("Savings goal deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete savings goal")
      console.error("Delete error:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleEditClick = (goal) => {
    setEditingGoal(goal)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingGoal(null)
  }

  const calculateProgress = (currentAmount, targetAmount) => {
    if (targetAmount <= 0) return 0
    return Math.min((currentAmount / targetAmount) * 100, 100)
  }

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-green-500"
    if (progress >= 75) return "bg-blue-500"
    if (progress >= 50) return "bg-yellow-500"
    if (progress >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadGoals} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600 mt-1">Track your progress toward financial goals</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ApperIcon name="Target" className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No savings goals yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start building your financial future by setting your first savings goal.
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {goals.map((goal) => {
const progress = calculateProgress(goal.current_amount_c, goal.target_amount_c)
            const isCompleted = progress >= 100
const completionRate = Math.round(progress)
            const daysUntilTarget = Math.ceil(
              (new Date(goal.target_date_c) - new Date()) / (1000 * 60 * 60 * 24)
            )
            
            // Goal term badge styling
            const getTermBadgeColor = (term) => {
              switch(term) {
                case 'immediate': return 'bg-red-100 text-red-800'
                case 'short term': return 'bg-yellow-100 text-yellow-800' 
                case 'long term': return 'bg-green-100 text-green-800'
                default: return 'bg-gray-100 text-gray-800'
              }
            }
            
            const formatTermDisplay = (term) => {
              switch(term) {
                case 'immediate': return 'Immediate'
                case 'short term': return 'Short Term'
                case 'long term': return 'Long Term'
                default: return term
              }
            }

            return (
              <div
                key={goal.Id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{goal.title_c}</h3>
                      {isCompleted && (
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Completed
                        </div>
                      )}
                    </div>
                    {goal.notes_c && (
                      <p className="text-gray-600 text-sm mb-3">{goal.notes_c}</p>
                    )}
<div className="flex flex-wrap items-center gap-2 mb-4">
                      {goal.goal_term_c && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTermBadgeColor(goal.goal_term_c)}`}>
                          {formatTermDisplay(goal.goal_term_c)}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <ApperIcon name="Target" className="w-4 h-4" />
                        {completionRate}% Complete
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        Target: {formatDate(goal.target_date_c)}
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Clock" className="w-4 h-4" />
                        {daysUntilTarget > 0 
                          ? `${daysUntilTarget} days remaining`
                          : daysUntilTarget === 0 
                            ? "Due today" 
                            : `${Math.abs(daysUntilTarget)} days overdue`
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(goal)}
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal.Id)}
                      disabled={deletingId === goal.Id}
                    >
                      {deletingId === goal.Id ? (
                        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                      ) : (
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-600">Saved: </span>
<span className="font-semibold text-gray-900">
                        {formatCurrency(goal.current_amount_c)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Goal: </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(goal.target_amount_c)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span>Remaining: </span>
                    <span className="font-medium">
                      {formatCurrency(Math.max(0, goal.target_amount_c - goal.current_amount_c))}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingGoal ? "Edit Savings Goal" : "Create New Savings Goal"}
        size="md"
      >
        <SavingsGoalForm
          onSubmit={editingGoal ? handleEditGoal : handleCreateGoal}
          onCancel={handleCloseForm}
          initialData={editingGoal}
        />
      </Modal>
    </div>
  )
}

export default SavingsGoals