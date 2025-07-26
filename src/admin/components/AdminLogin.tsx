"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import toast from "react-hot-toast"

const AdminLogin = () => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const success = login(password)
    
    if (success) {
      toast.success("Welcome to Admin Dashboard!")
    } else {
      toast.error("Invalid password. Please try again.")
      setPassword("")
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="text-white" size={24} />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-300">Enter your password to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Access Dashboard"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Demo Password: <span className="text-gold font-mono">admin123</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
