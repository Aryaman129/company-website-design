"use client"

import ProtectedAdminRoute from "../../src/admin/components/ProtectedAdminRoute"
import AdminDashboard from "../../src/admin/pages/AdminDashboard"

export default function AdminPage() {
  return (
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  )
}
