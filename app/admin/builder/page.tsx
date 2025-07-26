"use client"

import ProtectedAdminRoute from "../../../src/admin/components/ProtectedAdminRoute"
import RealVisualBuilder from "../../../src/admin/pages/RealVisualBuilder"

export default function VisualBuilderPage() {
  return (
    <ProtectedAdminRoute showLayout={false}>
      <RealVisualBuilder />
    </ProtectedAdminRoute>
  )
}
