"use client"

import { ReactNode, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  FileText,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Eye,
  Users
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import toast from "react-hot-toast"

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
  }

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Content", path: "/admin/content", icon: FileText },
    { name: "Media", path: "/admin/images", icon: Image },
    { name: "Testimonials", path: "/admin/testimonials", icon: Users },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ]

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/shyam-trading-logo.png"
              alt="Shyam Trading Company"
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-gold text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/"
              target="_blank"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Eye size={20} />
              <span className="font-medium">View Site</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-2"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home size={16} />
                <span>View Site</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
