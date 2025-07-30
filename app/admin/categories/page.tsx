"use client"

import { useState } from "react"
import { useAuth } from "../../../src/contexts/AuthContext"
import AdminLogin from "../../../src/admin/components/AdminLogin"
import AdminLayout from "../../../src/admin/components/AdminLayout"
import CategoriesManagement from "../../../src/admin/pages/CategoriesManagement"

export default function CategoriesPage() {
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

  return (
    <AdminLayout>
      <CategoriesManagement />
    </AdminLayout>
  )
}
