"use client"

import { useAuth } from "../../contexts/AuthContext"
import AdminLogin from "./AdminLogin"
import AdminLayout from "./AdminLayout"

interface ProtectedAdminRouteProps {
  children: React.ReactNode
  showLayout?: boolean
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ 
  children, 
  showLayout = true 
}) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  if (showLayout) {
    return (
      <AdminLayout>
        {children}
      </AdminLayout>
    )
  }

  return <>{children}</>
}

export default ProtectedAdminRoute
