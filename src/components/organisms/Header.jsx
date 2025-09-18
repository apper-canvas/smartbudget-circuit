import React, { useState, useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from 'react-redux'
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { AuthContext } from "@/App"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
  const navigation = [
{ name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Transactions", path: "/transactions", icon: "Receipt" },
    { name: "Budget", path: "/budget", icon: "PieChart" },
    { name: "Savings Goals", path: "/savings-goals", icon: "Target" },
    { name: "Reports", path: "/reports", icon: "BarChart3" }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-2 mr-3">
                <ApperIcon name="Wallet" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                SmartBudget
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50 hover:text-primary-600",
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600"
                    )
                  }
                >
                  <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                  {item.name}
                </NavLink>
              ))}
            </nav>

{/* User menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || 'User'}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
              >
                <ApperIcon 
                  name={isMobileMenuOpen ? "X" : "Menu"} 
                  className="w-5 h-5" 
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={toggleMobileMenu}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-40 md:hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-2 mr-3">
                        <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">SmartBudget</h2>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMobileMenu}
                      className="p-1"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={toggleMobileMenu}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-primary-50 text-primary-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )
                        }
                      >
                        <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                        {item.name}
                      </NavLink>
                    ))}
</nav>
                    
                    {/* Mobile user menu */}
                    <div className="px-4 py-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {user?.firstName || 'User'}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={logout}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

export default Header