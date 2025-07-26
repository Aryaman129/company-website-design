"use client"

import ProtectedAdminRoute from "../../../src/admin/components/ProtectedAdminRoute"
import TestimonialsManagement from "../../../src/admin/pages/TestimonialsManagement"

export default function AdminTestimonialsPage() {
  return (
    <ProtectedAdminRoute>
      <TestimonialsManagement />
    </ProtectedAdminRoute>
  )
}
