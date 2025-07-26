"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, 
  EyeOff, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Save, 
  Settings,
  Palette,
  Type,
  Image,
  Layout,
  Plus,
  X,
  Edit3,
  RefreshCw,
  Home,
  Package,
  Info,
  Phone
} from 'lucide-react'
import { useWebsiteData } from '../../hooks/useWebsiteData'
import RealTimePreview from '../components/builder/RealTimePreview'
import ContentEditor from '../components/builder/ContentEditor'
import QuickAddProduct from '../components/builder/QuickAddProduct'
import ThemeCustomizer from '../components/builder/ThemeCustomizer'
import toast from 'react-hot-toast'

const RealVisualBuilder: React.FC = () => {
  const { products, content, settings, loading, refreshData } = useWebsiteData()
  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'about' | 'contact'>('home')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)
  const [elementData, setElementData] = useState<any>(null)
  const [showContentEditor, setShowContentEditor] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)

  const pages = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'about', name: 'About', icon: Info },
    { id: 'contact', name: 'Contact', icon: Phone }
  ]

  const previewModes = [
    { id: 'desktop', name: 'Desktop', icon: Monitor, width: '100%' },
    { id: 'tablet', name: 'Tablet', icon: Tablet, width: '768px' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, width: '375px' }
  ]

  const handleElementSelect = (element: HTMLElement, data: any) => {
    setSelectedElement(element)
    setElementData(data)
    setShowContentEditor(true)
  }

  const handleCloseEditor = () => {
    setShowContentEditor(false)
    setSelectedElement(null)
    setElementData(null)
  }

  const handleSave = async () => {
    try {
      // The data is automatically saved through the useWebsiteData hook
      // when content is updated via ContentEditor
      toast.success('Website saved successfully!')
    } catch (error) {
      toast.error('Failed to save website')
    }
  }

  const handleRefresh = () => {
    refreshData()
    toast.success('Data refreshed!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Visual Builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Visual Builder</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Page Selector */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Pages</h3>
              <div className="grid grid-cols-2 gap-2">
                {pages.map((page) => {
                  const Icon = page.icon
                  return (
                    <button
                      key={page.id}
                      onClick={() => setCurrentPage(page.id as any)}
                      className={`flex items-center space-x-2 p-3 rounded-lg text-sm transition-colors ${
                        currentPage === page.id
                          ? 'bg-gold text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{page.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content Info */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Content Overview</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Products:</span>
                  <span className="font-medium">{products?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hero Title:</span>
                  <span className="font-medium truncate ml-2">
                    {content?.hero?.title?.slice(0, 20) || 'Not set'}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Company:</span>
                  <span className="font-medium truncate ml-2">
                    {settings?.company?.name || 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleRefresh}
                  className="w-full flex items-center space-x-2 p-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <RefreshCw size={16} />
                  <span>Refresh Data</span>
                </button>
                
                <button
                  onClick={() => window.open('/admin/content', '_blank')}
                  className="w-full flex items-center space-x-2 p-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Edit3 size={16} />
                  <span>Content Manager</span>
                </button>
                
                <button
                  onClick={() => window.open('/admin/products', '_blank')}
                  className="w-full flex items-center space-x-2 p-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Package size={16} />
                  <span>Product Manager</span>
                </button>

                <button
                  onClick={() => setShowQuickAdd(true)}
                  className="w-full flex items-center space-x-2 p-2 text-sm bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition-colors"
                >
                  <Plus size={16} />
                  <span>Quick Add Product</span>
                </button>

                <button
                  onClick={() => setShowThemeCustomizer(true)}
                  className="w-full flex items-center space-x-2 p-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Palette size={16} />
                  <span>Theme Customizer</span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-3">How to Edit</h3>
              <div className="text-xs text-gray-600 space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Click "Enable Editing" in the preview</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Click on any text, image, or element to edit</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Changes are saved automatically</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-gold rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>View live site to see changes</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!showSidebar && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Layout size={20} />
                </button>
              )}
              
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Page:</span>
                <span className="text-sm text-gold font-medium capitalize">{currentPage}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Preview Mode Selector */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {previewModes.map((mode) => {
                  const Icon = mode.icon
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setPreviewMode(mode.id as any)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                        previewMode === mode.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="hidden sm:inline">{mode.name}</span>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <RealTimePreview
          currentPage={currentPage}
          previewMode={previewMode}
          onElementSelect={handleElementSelect}
        />
      </div>

      {/* Content Editor Modal */}
      {showContentEditor && (
        <ContentEditor
          selectedElement={selectedElement}
          elementData={elementData}
          onClose={handleCloseEditor}
        />
      )}

      {/* Quick Add Product Modal */}
      <QuickAddProduct
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
      />

      {/* Theme Customizer Modal */}
      <ThemeCustomizer
        isOpen={showThemeCustomizer}
        onClose={() => setShowThemeCustomizer(false)}
      />
    </div>
  )
}

export default RealVisualBuilder
