import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";
import { formatCurrency, formatDate } from "@/utils/formatters";

// Utility functions for formatting
const formatTags = (tags) => {
  if (!tags) return [];
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }
  if (Array.isArray(tags)) {
    return tags;
  }
  return [];
};

const formatDateTime = (datetime) => {
  if (!datetime) return 'N/A';
  try {
    const date = new Date(datetime);
    return date.toLocaleString();
  } catch (error) {
    return 'Invalid Date';
  }
};

const TransactionTable = ({
  transactions, 
  onEdit, 
  onDelete,
  showFilters = true 
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

// Get unique categories for filter
  const categories = transactions && transactions.length > 0 
    ? [...new Set(transactions.map(t => t.category_c?.Name || t.category_c || 'Uncategorized'))].sort()
    : [];
// Filter and sort transactions
  const filteredTransactions = (transactions || [])
    .filter(transaction => {
      const description = transaction.description_c || ''
      const category = transaction.category_c?.Name || transaction.category_c || ''
      const matchesSearch = description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !categoryFilter || category === categoryFilter
      const matchesType = !typeFilter || transaction.type_c === typeFilter
      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => {
let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === "date_c") {
        aValue = new Date(a.date_c)
        bValue = new Date(b.date_c)
      } else if (sortBy === "amount_c") {
        aValue = parseFloat(a.amount_c)
        bValue = parseFloat(b.amount_c)
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return "ArrowUpDown"
    return sortOrder === "asc" ? "ArrowUp" : "ArrowDown"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Transactions
          <div className="text-sm font-normal text-gray-500">
            {filteredTransactions.length} transactions
          </div>
        </CardTitle>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("")
                  setTypeFilter("")
                }}
                className="h-9"
              >
                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
onClick={() => handleSort("date_c")}
                    className="h-auto p-0 font-medium text-gray-600 hover:text-gray-900"
                  >
                    Date
                    <ApperIcon name={getSortIcon("date_c")} className="w-4 h-4 ml-1" />
                  </Button>
                </th>
<th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Tags</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Range</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">DateTime</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">
                  <Button
variant="ghost"
                    size="sm"
                    onClick={() => handleSort("amount_c")}
                    className="h-auto p-0 font-medium text-gray-600 hover:text-gray-900 ml-auto"
                  >
Amount
                    <ApperIcon name={getSortIcon("amount_c")} className="w-4 h-4 ml-1" />
                  </Button>
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
{filteredTransactions.map((transaction) => (
                <tr key={transaction.Id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(transaction.date_c)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{transaction.description_c}</div>
                  </td>
                  <td className="py-3 px-4">
<Badge variant="default">{transaction.category_c?.Name || transaction.category_c}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {formatTags(transaction.Tags).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.range_c || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDateTime(transaction.datetime_c)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={transaction.type_c === "income" ? "success" : "danger"}>
                      {transaction.type_c}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      "font-semibold",
transaction.type_c === "income" ? "text-green-600" : "text-red-600"
                    )}>
                      {transaction.type_c === "income" ? "+" : "-"}{formatCurrency(transaction.amount_c || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8 p-0"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(transaction.Id)}
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
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <ApperIcon name="Receipt" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {searchTerm || categoryFilter || typeFilter 
                  ? "Try adjusting your filters to see more results."
                  : "Start by adding your first transaction."
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TransactionTable