"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, 
  Type, 
  Layout, 
  Smartphone, 
  Monitor, 
  Tablet,
  Download,
  Upload,
  RotateCcw,
  Save
} from 'lucide-react'
import { useWebsiteBuilder } from '../../contexts/WebsiteBuilderContext'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="text-xs text-gray-500 mt-1">{value}</div>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded-md"
        />
      </div>
    </div>
  )
}

interface FontSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}

const FontSelector: React.FC<FontSelectorProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
      >
        {options.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>
      <div className="text-sm text-gray-600" style={{ fontFamily: value }}>
        The quick brown fox jumps over the lazy dog
      </div>
    </div>
  )
}

const ThemePanel: React.FC = () => {
  const { state, dispatch } = useWebsiteBuilder()
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'presets'>('colors')

  const theme = state.websiteData.theme

  const handleColorChange = (colorKey: string, value: string) => {
    dispatch({
      type: 'UPDATE_THEME',
      payload: {
        colors: {
          ...theme.colors,
          [colorKey]: value
        }
      }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const handleFontChange = (fontKey: string, value: string) => {
    dispatch({
      type: 'UPDATE_THEME',
      payload: {
        fonts: {
          ...theme.fonts,
          [fontKey]: value
        }
      }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const handleSpacingChange = (spacingKey: string, value: string) => {
    dispatch({
      type: 'UPDATE_THEME',
      payload: {
        spacing: {
          ...theme.spacing,
          [spacingKey]: value
        }
      }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const presetThemes = [
    {
      name: 'Shyam Gold',
      colors: {
        primary: '#D4AF37',
        secondary: '#2D2D2D',
        accent: '#E6C55A',
        background: '#FFFFFF',
        text: '#333333'
      }
    },
    {
      name: 'Professional Blue',
      colors: {
        primary: '#2563EB',
        secondary: '#1E293B',
        accent: '#3B82F6',
        background: '#FFFFFF',
        text: '#1F2937'
      }
    },
    {
      name: 'Modern Green',
      colors: {
        primary: '#059669',
        secondary: '#064E3B',
        accent: '#10B981',
        background: '#FFFFFF',
        text: '#111827'
      }
    },
    {
      name: 'Elegant Purple',
      colors: {
        primary: '#7C3AED',
        secondary: '#3C1A78',
        accent: '#8B5CF6',
        background: '#FFFFFF',
        text: '#1F2937'
      }
    }
  ]

  const applyPresetTheme = (preset: typeof presetThemes[0]) => {
    dispatch({
      type: 'UPDATE_THEME',
      payload: {
        colors: {
          ...theme.colors,
          ...preset.colors
        }
      }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const resetToDefault = () => {
    dispatch({
      type: 'UPDATE_THEME',
      payload: {
        colors: {
          primary: '#D4AF37',
          secondary: '#2D2D2D',
          accent: '#E6C55A',
          background: '#FFFFFF',
          text: '#333333'
        },
        fonts: {
          primary: 'Inter',
          secondary: 'Playfair Display',
          sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem'
          }
        }
      }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const exportTheme = () => {
    const themeData = JSON.stringify(theme, null, 2)
    const blob = new Blob([themeData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans Pro',
    'Playfair Display',
    'Merriweather',
    'Lora',
    'PT Serif',
    'Crimson Text'
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Theme Settings</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={exportTheme}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              title="Export theme"
            >
              <Download size={16} />
            </button>
            <button
              onClick={resetToDefault}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              title="Reset to default"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'colors', label: 'Colors', icon: Palette },
            { id: 'typography', label: 'Fonts', icon: Type },
            { id: 'spacing', label: 'Layout', icon: Layout },
            { id: 'presets', label: 'Presets', icon: Save }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1 px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Brand Colors</h4>
              <div className="space-y-3">
                <ColorPicker
                  label="Primary Color"
                  value={theme.colors.primary}
                  onChange={(value) => handleColorChange('primary', value)}
                />
                <ColorPicker
                  label="Secondary Color"
                  value={theme.colors.secondary}
                  onChange={(value) => handleColorChange('secondary', value)}
                />
                <ColorPicker
                  label="Accent Color"
                  value={theme.colors.accent}
                  onChange={(value) => handleColorChange('accent', value)}
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Base Colors</h4>
              <div className="space-y-3">
                <ColorPicker
                  label="Background"
                  value={theme.colors.background}
                  onChange={(value) => handleColorChange('background', value)}
                />
                <ColorPicker
                  label="Text Color"
                  value={theme.colors.text}
                  onChange={(value) => handleColorChange('text', value)}
                />
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
              <div 
                className="p-4 rounded-lg border"
                style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
              >
                <h3 
                  className="text-lg font-bold mb-2"
                  style={{ color: theme.colors.primary }}
                >
                  Sample Heading
                </h3>
                <p className="mb-3">
                  This is sample text to show how your colors work together.
                </p>
                <button
                  className="px-4 py-2 rounded-md font-medium"
                  style={{ 
                    backgroundColor: theme.colors.primary, 
                    color: theme.colors.background 
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="ml-2 px-4 py-2 rounded-md font-medium border"
                  style={{ 
                    borderColor: theme.colors.accent,
                    color: theme.colors.accent,
                    backgroundColor: 'transparent'
                  }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            <FontSelector
              label="Primary Font (Body Text)"
              value={theme.fonts.primary}
              onChange={(value) => handleFontChange('primary', value)}
              options={fontOptions}
            />
            
            <FontSelector
              label="Secondary Font (Headings)"
              value={theme.fonts.secondary}
              onChange={(value) => handleFontChange('secondary', value)}
              options={fontOptions}
            />

            {/* Font Size Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Font Sizes</h4>
              <div className="space-y-2">
                {Object.entries(theme.fonts.sizes).map(([size, value]) => (
                  <div key={size} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{size}</span>
                    <span 
                      className="font-medium"
                      style={{ 
                        fontSize: value,
                        fontFamily: theme.fonts.primary 
                      }}
                    >
                      Sample Text ({value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Spacing Scale</h4>
              <div className="space-y-3">
                {Object.entries(theme.spacing).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                      <div className="text-xs text-gray-500">{value}</div>
                    </div>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleSpacingChange(key, e.target.value)}
                      className="w-20 px-2 py-1 text-xs border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Theme Presets</h4>
              <div className="grid grid-cols-1 gap-3">
                {presetThemes.map((preset) => (
                  <motion.div
                    key={preset.name}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gold transition-colors"
                    onClick={() => applyPresetTheme(preset)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{preset.name}</h5>
                      <div className="flex space-x-1">
                        {Object.values(preset.colors).slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded-md text-sm"
                      style={{ 
                        backgroundColor: preset.colors.background,
                        color: preset.colors.text,
                        border: `1px solid ${preset.colors.primary}20`
                      }}
                    >
                      <div 
                        className="font-semibold mb-1"
                        style={{ color: preset.colors.primary }}
                      >
                        Sample Heading
                      </div>
                      <div>Sample text content</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ThemePanel
