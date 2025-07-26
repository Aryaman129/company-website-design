"use client"

import ProtectedAdminRoute from "../../../src/admin/components/ProtectedAdminRoute"
import SettingsManagement from "../../../src/admin/pages/SettingsManagement"
export default function AdminSettingsPage() {
  return (
    <ProtectedAdminRoute>
      <SettingsManagement />
    </ProtectedAdminRoute>
  )
}
