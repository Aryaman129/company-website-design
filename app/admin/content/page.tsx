"use client"

import ProtectedAdminRoute from "../../../src/admin/components/ProtectedAdminRoute"
import ContentManagement from "../../../src/admin/pages/ContentManagement"

export default function AdminContentPage() {
  return (
    <ProtectedAdminRoute>
      <ContentManagement />
    </ProtectedAdminRoute>
  )
}
