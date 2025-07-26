"use client"

import ProtectedAdminRoute from "../../../src/admin/components/ProtectedAdminRoute"
import ProductManagement from "../../../src/admin/pages/ProductManagement"

export default function AdminProductsPage() {
  return (
    <ProtectedAdminRoute>
      <ProductManagement />
    </ProtectedAdminRoute>
  )
}
