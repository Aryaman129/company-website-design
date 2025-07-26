"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, X, Save, RefreshCw, Type, Image as ImageIcon } from 'lucide-react'
import { useWebsiteData } from '../../../hooks/useWebsiteData'
import toast from 'react-hot-toast'

interface ThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useWebsiteData()
  const [loading, setLoading] = useState(false)
  const [themeData, setThemeData] = useState({
    primaryColor: '#D4AF37', // Gold
    secondaryColor: '#2D2D2D', // Dark
    accentColor: '#F5F5F5', // Light gray
    fontFamily: 'Inter',
    logoUrl: '',
    backgroundImage: ''
  })

  const colorPresets = [
    { name: 'Gold & Dark', primary: '#D4AF37', secondary: '#2D2D2D', accent: '#F5F5F5' },
    { name: 'Blue & White', primary: '#3B82F6', secondary: '#1E293B', accent: '#F8FAFC' },
    { name: 'Green & Black', primary: '#10B981', secondary: '#111827', accent: '#F9FAFB' },
    { name: 'Purple & Gray', primary: '#8B5CF6', secondary: '#374151', accent: '#F3F4F6' },
    { name: 'Red & Dark', primary: '#EF4444', secondary: '#1F2937', accent: '#F9FAFB' }
  ]

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Merriweather'
  ]

  useEffect(() => {
    if (settings) {
      setThemeData({
        primaryColor: settings.theme?.primaryColor || '#D4AF37',
        secondaryColor: settings.theme?.secondaryColor || '#2D2D2D',
        accentColor: settings.theme?.accentColor || '#F5F5F5',
        fontFamily: settings.theme?.fontFamily || 'Inter',
        logoUrl: settings.company?.logo || '',
        backgroundImage: settings.theme?.backgroundImage || ''
      })
    }
  }, [settings])

  const applyTheme = (colors: { primary: string; secondary: string; accent: string }) => {
    setThemeData(prev => ({
      ...prev,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accentColor: colors.accent
    }))

    // Apply theme to CSS variables immediately for preview
    document.documentElement.style.setProperty('--color-primary', colors.primary)
    document.documentElement.style.setProperty('--color-secondary', colors.secondary)
    document.documentElement.style.setProperty('--color-accent', colors.accent)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const updatedSettings = {
        ...settings,
        theme: {
          primaryColor: themeData.primaryColor,
          secondaryColor: themeData.secondaryColor,
          accentColor: themeData.accentColor,
          fontFamily: themeData.fontFamily,
          backgroundImage: themeData.backgroundImage
        },
        company: {
          ...settings?.company,
          logo: themeData.logoUrl
        }
      }

      await updateSettings(updatedSettings)
      
      // Apply theme to CSS variables
      document.documentElement.style.setProperty('--color-primary', themeData.primaryColor)
      document.documentElement.style.setProperty('--color-secondary', themeData.secondaryColor)
      document.documentElement.style.setProperty('--color-accent', themeData.accentColor)
      document.documentElement.style.setProperty('--font-family', themeData.fontFamily)

      toast.success('Theme updated successfully!')
      onClose()
    } catch (error) {
      console.error('Failed to update theme:', error)
      toast.error('Failed to update theme')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setThemeData({
      primaryColor: '#D4AF37',
      secondaryColor: '#2D2D2D',
      accentColor: '#F5F5F5',
      fontFamily: 'Inter',
      logoUrl: settings?.company?.logo || '',
      backgroundImage: ''
    })
    applyTheme({ primary: '#D4AF37', secondary: '#2D2D2D', accent: '#F5F5F5' })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Palette size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Theme Customizer</h3>
                <p className="text-sm text-gray-500">Customize your website's appearance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Color Presets */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Color Presets</h4>
              <div className="grid grid-cols-1 gap-2">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyTheme({ primary: preset.primary, secondary: preset.secondary, accent: preset.accent })}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex space-x-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                    </div>
                    <span className="text-sm font-medium">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Custom Colors</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={themeData.primaryColor}
                      onChange={(e) => setThemeData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={themeData.primaryColor}
                      onChange={(e) => setThemeData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Secondary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={themeData.secondaryColor}
                      onChange={(e) => setThemeData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={themeData.secondaryColor}
                      onChange={(e) => setThemeData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Typography</h4>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Font Family</label>
                <select
                  value={themeData.fontFamily}
                  onChange={(e) => setThemeData(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Logo */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Logo</h4>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={themeData.logoUrl}
                  onChange={(e) => setThemeData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter logo URL"
                />
                {themeData.logoUrl && (
                  <img
                    src={themeData.logoUrl}
                    alt="Logo preview"
                    className="mt-2 h-12 object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              <span>Reset</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{loading ? 'Saving...' : 'Save Theme'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ThemeCustomizer
