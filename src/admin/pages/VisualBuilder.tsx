"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, 
  EyeOff, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Undo, 
  Redo, 
  Save, 
  Settings,
  Layers,
  Palette,
  Type,
  Image,
  Layout,
  Plus,
  X
} from 'lucide-react'
import { useWebsiteBuilder } from '../contexts/WebsiteBuilderContext'
import { WebsiteBuilderProvider } from '../contexts/WebsiteBuilderContext'
import ComponentLibrary from '../components/builder/ComponentLibrary'
import LivePreview from '../components/builder/LivePreview'
import PropertyPanel from '../components/builder/PropertyPanel'
import LayersPanel from '../components/builder/LayersPanel'
import ThemePanel from '../components/builder/ThemePanel'

const VisualBuilderContent: React.FC = () => {
  const { state, actions } = useWebsiteBuilder()
  const [activePanel, setActivePanel] = useState<'components' | 'layers' | 'properties' | 'theme' | null>('components')
  const [showPreview, setShowPreview] = useState(true)

  const previewModeIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  }

  const PreviewIcon = previewModeIcons[state.previewMode]

  const handleSave = async () => {
    actions.saveState()
    // Here you would also save to your backend/database
    try {
      // Example: await saveWebsiteData(state.websiteData)
      console.log('Saving website data:', state.websiteData)
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const togglePanel = (panel: typeof activePanel) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Top Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section - Navigation */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Visual Website Builder</h1>
            <div className="flex items-center space-x-2">
              {(['home', 'about', 'products', 'contact'] as const).map((page) => (
                <button
                  key={page}
                  onClick={() => actions.setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    state.currentPage === page
                      ? 'bg-gold text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Center Section - Preview Controls */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {(['desktop', 'tablet', 'mobile'] as const).map((mode) => {
                const Icon = previewModeIcons[mode]
                return (
                  <button
                    key={mode}
                    onClick={() => actions.setPreviewMode(mode)}
                    className={`p-2 rounded-md transition-colors ${
                      state.previewMode === mode
                        ? 'bg-white text-gold shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title={`${mode} preview`}
                  >
                    <Icon size={18} />
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-md transition-colors ${
                showPreview ? 'text-gold' : 'text-gray-600 hover:text-gray-900'
              }`}
              title={showPreview ? 'Hide preview' : 'Show preview'}
            >
              {showPreview ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={actions.undo}
              disabled={state.historyIndex <= 0}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo size={18} />
            </button>
            
            <button
              onClick={actions.redo}
              disabled={state.historyIndex >= state.history.length - 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo size={18} />
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-gold text-white px-4 py-2 rounded-md hover:bg-gold-dark transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex pt-16">
        {/* Left Sidebar - Tools */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
          <button
            onClick={() => togglePanel('components')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'components'
                ? 'bg-gold text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Components"
          >
            <Plus size={20} />
          </button>
          
          <button
            onClick={() => togglePanel('layers')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'layers'
                ? 'bg-gold text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Layers"
          >
            <Layers size={20} />
          </button>
          
          <button
            onClick={() => togglePanel('theme')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'theme'
                ? 'bg-gold text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Theme"
          >
            <Palette size={20} />
          </button>
          
          <button
            onClick={() => togglePanel('properties')}
            className={`p-3 rounded-lg transition-colors ${
              activePanel === 'properties'
                ? 'bg-gold text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Properties"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Left Panel */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-r border-gray-200 overflow-hidden"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activePanel === 'components' && 'Components'}
                    {activePanel === 'layers' && 'Layers'}
                    {activePanel === 'theme' && 'Theme'}
                    {activePanel === 'properties' && 'Properties'}
                  </h2>
                  <button
                    onClick={() => setActivePanel(null)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {activePanel === 'components' && <ComponentLibrary />}
                  {activePanel === 'layers' && <LayersPanel />}
                  {activePanel === 'theme' && <ThemePanel />}
                  {activePanel === 'properties' && <PropertyPanel />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Preview Area */}
        <div className="flex-1 flex flex-col">
          {showPreview ? (
            <LivePreview />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <EyeOff size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Hidden</h3>
                <p className="text-gray-600">Click the eye icon to show the preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Page: {state.currentPage}</span>
            <span>Mode: {state.previewMode}</span>
            {state.selectedComponent && (
              <span>Selected: {state.selectedComponent}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {state.isDirty && (
              <span className="text-orange-600">Unsaved changes</span>
            )}
            <span>History: {state.historyIndex + 1}/{state.history.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const VisualBuilder: React.FC = () => {
  return (
    <WebsiteBuilderProvider>
      <VisualBuilderContent />
    </WebsiteBuilderProvider>
  )
}

export default VisualBuilder
