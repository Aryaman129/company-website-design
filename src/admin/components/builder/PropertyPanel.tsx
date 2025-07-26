"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Type, 
  Palette, 
  Layout, 
  Image as ImageIcon, 
  Link as LinkIcon,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Move
} from 'lucide-react'
import { useWebsiteBuilder } from '../../contexts/WebsiteBuilderContext'
import { getComponentDefinition } from './ComponentRegistry'

interface PropertyInputProps {
  label: string
  type: string
  value: any
  onChange: (value: any) => void
  options?: string[]
  placeholder?: string
}

const PropertyInput: React.FC<PropertyInputProps> = ({
  label,
  type,
  value,
  onChange,
  options,
  placeholder
}) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (newValue: any) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={localValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        )

      case 'textarea':
        return (
          <textarea
            value={localValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={localValue || ''}
            onChange={(e) => handleChange(Number(e.target.value))}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        )

      case 'color':
        return (
          <div className="flex space-x-2">
            <input
              type="color"
              value={localValue || '#000000'}
              onChange={(e) => handleChange(e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={localValue || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
        )

      case 'select':
        return (
          <select
            value={localValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          >
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )

      case 'boolean':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localValue || false}
              onChange={(e) => handleChange(e.target.checked)}
              className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
            />
            <span className="text-sm text-gray-700">Enabled</span>
          </label>
        )

      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={localValue || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Image URL or path"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            />
            <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
              <ImageIcon size={16} className="inline mr-2" />
              Browse Images
            </button>
            {localValue && (
              <div className="mt-2">
                <img
                  src={localValue}
                  alt="Preview"
                  className="w-full h-20 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        )

      case 'url':
        return (
          <div className="flex space-x-2">
            <input
              type="url"
              value={localValue || ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder || 'https://example.com'}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            />
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              <LinkIcon size={16} />
            </button>
          </div>
        )

      default:
        return (
          <input
            type="text"
            value={localValue || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {renderInput()}
    </div>
  )
}

const PropertyPanel: React.FC = () => {
  const { state, dispatch } = useWebsiteBuilder()
  const [activeTab, setActiveTab] = useState<'properties' | 'styles' | 'advanced'>('properties')

  const selectedComponent = state.selectedComponent
    ? state.websiteData.pages[state.currentPage]
        ?.flatMap(section => section.components)
        ?.find(comp => comp.id === state.selectedComponent)
    : null

  const selectedSection = state.selectedSection
    ? state.websiteData.pages[state.currentPage]
        ?.find(section => section.id === state.selectedSection)
    : null

  const componentDefinition = selectedComponent 
    ? getComponentDefinition(selectedComponent.type)
    : null

  const handlePropertyChange = (key: string, value: any) => {
    if (selectedComponent) {
      dispatch({
        type: 'UPDATE_COMPONENT',
        payload: {
          id: selectedComponent.id,
          data: {
            props: { ...selectedComponent.props, [key]: value }
          }
        }
      })
      dispatch({ type: 'SET_DIRTY', payload: true })
    }
  }

  const handleStyleChange = (key: string, value: any) => {
    if (selectedComponent) {
      dispatch({
        type: 'UPDATE_COMPONENT',
        payload: {
          id: selectedComponent.id,
          data: {
            styles: { ...selectedComponent.styles, [key]: value }
          }
        }
      })
      dispatch({ type: 'SET_DIRTY', payload: true })
    }
  }

  const handleSectionChange = (key: string, value: any) => {
    if (selectedSection) {
      dispatch({
        type: 'UPDATE_SECTION',
        payload: {
          id: selectedSection.id,
          data: { [key]: value }
        }
      })
      dispatch({ type: 'SET_DIRTY', payload: true })
    }
  }

  const handleDeleteComponent = () => {
    if (selectedComponent && selectedSection) {
      dispatch({
        type: 'REMOVE_COMPONENT',
        payload: {
          sectionId: selectedSection.id,
          componentId: selectedComponent.id
        }
      })
      dispatch({ type: 'SET_DIRTY', payload: true })
    }
  }

  const handleDuplicateComponent = () => {
    if (selectedComponent && selectedSection) {
      const duplicatedComponent = {
        ...selectedComponent,
        id: `${selectedComponent.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      
      dispatch({
        type: 'ADD_COMPONENT',
        payload: {
          sectionId: selectedSection.id,
          component: duplicatedComponent
        }
      })
      dispatch({ type: 'SET_DIRTY', payload: true })
    }
  }

  if (!selectedComponent && !selectedSection) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="mb-4">
          <Layout size={48} className="mx-auto text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Selection</h3>
        <p className="text-sm">
          Select a component or section to edit its properties
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">
            {selectedComponent ? componentDefinition?.name : selectedSection?.name}
          </h3>
          
          {selectedComponent && (
            <div className="flex items-center space-x-1">
              <button
                onClick={handleDuplicateComponent}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                title="Duplicate"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={handleDeleteComponent}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {['properties', 'styles', 'advanced'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'properties' && selectedComponent && componentDefinition && (
          <div className="space-y-4">
            {componentDefinition.editableProps.map((prop) => (
              <PropertyInput
                key={prop.key}
                label={prop.label}
                type={prop.type}
                value={selectedComponent.props[prop.key]}
                onChange={(value) => handlePropertyChange(prop.key, value)}
                options={prop.options}
                placeholder={prop.placeholder}
              />
            ))}
          </div>
        )}

        {activeTab === 'properties' && selectedSection && (
          <div className="space-y-4">
            <PropertyInput
              label="Section Name"
              type="text"
              value={selectedSection.name}
              onChange={(value) => handleSectionChange('name', value)}
              placeholder="Enter section name"
            />
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Visible</label>
              <button
                onClick={() => handleSectionChange('visible', !selectedSection.visible)}
                className={`p-2 rounded-md transition-colors ${
                  selectedSection.visible
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-400 bg-gray-50'
                }`}
              >
                {selectedSection.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'styles' && (
          <div className="space-y-4">
            <PropertyInput
              label="Background Color"
              type="color"
              value={selectedComponent?.styles?.backgroundColor || selectedSection?.styles?.backgroundColor || ''}
              onChange={(value) => 
                selectedComponent 
                  ? handleStyleChange('backgroundColor', value)
                  : handleSectionChange('styles', { ...selectedSection?.styles, backgroundColor: value })
              }
            />
            
            <PropertyInput
              label="Text Color"
              type="color"
              value={selectedComponent?.styles?.color || selectedSection?.styles?.color || ''}
              onChange={(value) => 
                selectedComponent 
                  ? handleStyleChange('color', value)
                  : handleSectionChange('styles', { ...selectedSection?.styles, color: value })
              }
            />
            
            <PropertyInput
              label="Padding"
              type="text"
              value={selectedComponent?.styles?.padding || selectedSection?.styles?.padding || ''}
              onChange={(value) => 
                selectedComponent 
                  ? handleStyleChange('padding', value)
                  : handleSectionChange('styles', { ...selectedSection?.styles, padding: value })
              }
              placeholder="e.g., 16px or 1rem"
            />
            
            <PropertyInput
              label="Margin"
              type="text"
              value={selectedComponent?.styles?.margin || selectedSection?.styles?.margin || ''}
              onChange={(value) => 
                selectedComponent 
                  ? handleStyleChange('margin', value)
                  : handleSectionChange('styles', { ...selectedSection?.styles, margin: value })
              }
              placeholder="e.g., 16px or 1rem"
            />
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <PropertyInput
              label="CSS Classes"
              type="text"
              value={selectedComponent?.props?.className || ''}
              onChange={(value) => handlePropertyChange('className', value)}
              placeholder="Enter CSS classes"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom CSS
              </label>
              <textarea
                rows={6}
                placeholder="Enter custom CSS styles..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent resize-none font-mono text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyPanel
