"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, RefreshCw, Building, Phone, Mail, Globe, Eye, Download, Upload, Database } from "lucide-react"
import { useWebsiteData } from "../../hooks/useWebsiteData"
import DatabaseStatus from "../components/DatabaseStatus"
import toast from "react-hot-toast"

const SettingsManagement = () => {
  const { settings, updateSettings, exportData, importData, loading } = useWebsiteData()
  const [formData, setFormData] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("company")

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleSave = async () => {
    if (!formData) return

    setSaving(true)
    try {
      await updateSettings(formData)
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev!,
      [section]: {
        ...prev![section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev!,
      [section]: {
        ...prev![section as keyof typeof prev],
        [subsection]: {
          ...prev![section as keyof typeof prev][subsection],
          [field]: value
        }
      }
    }))
  }

  const handleArrayChange = (section: string, field: string, value: string) => {
    const array = value.split('\n').filter(item => item.trim())
    setFormData(prev => ({
      ...prev!,
      [section]: {
        ...prev![section as keyof typeof prev],
        [field]: array
      }
    }))
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        await importData(file)
        // Reset file input
        event.target.value = ''
      } catch (error) {
        console.error('Import failed:', error)
      }
    }
  }

  const tabs = [
    { id: "company", name: "Company Info", icon: Building },
    { id: "contact", name: "Contact Details", icon: Phone },
    { id: "social", name: "Social Media", icon: Globe },
    { id: "seo", name: "SEO Settings", icon: Eye },
    { id: "categories", name: "Categories", icon: RefreshCw },
    { id: "database", name: "Database", icon: Database }
  ]

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your website settings and configuration</p>
        </div>
        <div className="flex space-x-3">
          <label className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 cursor-pointer">
            <Upload size={16} />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <motion.button
            onClick={exportData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            <Download size={16} />
            <span>Export</span>
          </motion.button>
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.05 }}
            whileTap={{ scale: saving ? 1 : 0.95 }}
            className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <RefreshCw className="animate-spin" size={16} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Company Info */}
          {activeTab === "company" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company?.name || ''}
                    onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.company?.tagline || ''}
                    onChange={(e) => handleInputChange('company', 'tagline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Established Year
                  </label>
                  <input
                    type="text"
                    value={formData.company?.established || ''}
                    onChange={(e) => handleInputChange('company', 'established', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={formData.company?.gst || ''}
                    onChange={(e) => handleInputChange('company', 'gst', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={formData.company?.logo || ''}
                    onChange={(e) => handleInputChange('company', 'logo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Large Logo URL
                  </label>
                  <input
                    type="text"
                    value={formData.company?.logoLarge || ''}
                    onChange={(e) => handleInputChange('company', 'logoLarge', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Contact Details */}
          {activeTab === "contact" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.contact?.phone || ''}
                    onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.contact?.email || ''}
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.contact?.address?.street || ''}
                      onChange={(e) => handleNestedInputChange('contact', 'address', 'street', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.contact?.address?.city || ''}
                      onChange={(e) => handleNestedInputChange('contact', 'address', 'city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Categories */}
          {activeTab === "categories" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Categories (one per line)
                </label>
                <textarea
                  value={Array.isArray(formData.categories) ? formData.categories.join('\n') : (formData.categories || '')}
                  onChange={(e) => handleArrayChange('categories', 'categories', e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                  placeholder="Steel Pipes&#10;Steel Bars&#10;Steel Sheets&#10;Stainless Steel&#10;Aluminum"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter each category on a new line. These will be used throughout the website for product filtering.
                </p>
              </div>
            </motion.div>
          )}

          {/* Database Tab */}
          {activeTab === "database" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <DatabaseStatus />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsManagement
