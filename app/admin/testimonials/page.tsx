"use client"

import { AuthProvider } from "../../../src/contexts/AuthContext"
import { useAuth } from "../../../src/contexts/AuthContext"
import AdminLogin from "../../../src/admin/components/AdminLogin"
import AdminLayout from "../../../src/admin/components/AdminLayout"
import TestimonialsManagement from "../../../src/admin/pages/TestimonialsManagement"
import { Toaster } from "react-hot-toast"

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <AdminLogin />
}

export default function AdminTestimonialsPage() {
  return (
    <AuthProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <TestimonialsManagement />
        </AdminLayout>
      </ProtectedAdminRoute>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #D4AF37",
          },
        }}
      />
    </AuthProvider>
  )
}
