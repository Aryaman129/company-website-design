"use client"

import ProtectedAdminRoute from "../../../src/admin/components/ProtectedAdminRoute"
import ImageManagement from "../../../src/admin/pages/ImageManagement"

export default function AdminImagesPage() {
  return (
    <ProtectedAdminRoute>
      <ImageManagement />
    </ProtectedAdminRoute>
  )
}
