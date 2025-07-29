"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Type, 
  Image as ImageIcon, 
  Palette, 
  Save, 
  X, 
  Upload,
  Link as LinkIcon,
  Settings
} from 'lucide-react'
import { useWebsiteData } from '../../../hooks/useWebsiteData'
import { uploadImage } from '../../../lib/imageUpload'
import toast from 'react-hot-toast'

interface ContentEditorProps {
  selectedElement: HTMLElement | null
  elementData: any
  onClose: () => void
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  selectedElement,
  elementData,
  onClose
}) => {
  const { content, updateContent, products, updateProduct, settings, updateSettings } = useWebsiteData()
  const [editValue, setEditValue] = useState('')
  const [editType, setEditType] = useState<'text' | 'image' | 'link' | 'style'>('text')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (selectedElement && elementData) {
      // Determine what type of content we're editing
      if (selectedElement.tagName === 'IMG') {
        setEditType('image')
        setEditValue((selectedElement as HTMLImageElement).src)
      } else if (selectedElement.tagName === 'A') {
        setEditType('link')
        setEditValue((selectedElement as HTMLAnchorElement).href)
      } else {
        setEditType('text')
        setEditValue(selectedElement.textContent || '')
      }
    }
  }, [selectedElement, elementData])

  // Detect what content section this element belongs to
  const detectContentSection = (element: HTMLElement) => {
    const classList = element.className
    const textContent = element.textContent || ''

    // More specific hero section detection
    if (classList.includes('hero-title') || (element.tagName === 'H1' && element.closest('.hero'))) {
      return { section: 'hero', field: 'title' }
    }
    if (classList.includes('hero-subtitle') || (element.tagName === 'P' && element.closest('.hero') && textContent.length > 50)) {
      return { section: 'hero', field: 'subtitle' }
    }

    // About section detection with better specificity
    if (element.closest('.about-section') || classList.includes('about')) {
      if (element.tagName === 'H2' && textContent.toLowerCase().includes('about')) {
        return { section: 'about', field: 'title' }
      }
      if (element.tagName === 'P' && textContent.length > 100) {
        return { section: 'about', field: 'description' }
      }
    }

    // CTA section detection
    if (element.closest('.cta-section') || classList.includes('cta') || element.closest('.gradient-gold')) {
      if (element.tagName === 'H2') {
        return { section: 'cta', field: 'title' }
      }
      if (element.tagName === 'P' && textContent.length > 50) {
        return { section: 'cta', field: 'description' }
      }
    }

    // Statistics section detection
    if (element.closest('.stats-section') || classList.includes('stat-number') || classList.includes('stat-label')) {
      if (classList.includes('stat-number') || (element.tagName === 'SPAN' && textContent.includes('+'))) {
        // Determine which statistic based on content or position
        if (textContent.includes('35') || textContent.toLowerCase().includes('year')) {
          return { section: 'statistics', field: 'yearsExperience' }
        }
        if (textContent.includes('500') || textContent.toLowerCase().includes('project')) {
          return { section: 'statistics', field: 'projectsCompleted' }
        }
        if (textContent.includes('300') || textContent.toLowerCase().includes('client')) {
          return { section: 'statistics', field: 'happyClients' }
        }
        if (textContent.includes('4.') || textContent.toLowerCase().includes('rating')) {
          return { section: 'statistics', field: 'rating' }
        }
      }
    }

    // Product detection with better identification
    const productCard = element.closest('.product-card')
    if (productCard) {
      // Find the product by looking for the title
      const titleElement = productCard.querySelector('h3')
      const productTitle = titleElement?.textContent

      if (element.tagName === 'H3') {
        return { section: 'product', field: 'name', productTitle, element: productCard }
      }
      if (element.tagName === 'P' && !element.textContent?.includes('₹')) {
        return { section: 'product', field: 'description', productTitle, element: productCard }
      }
      if (element.tagName === 'IMG') {
        return { section: 'product', field: 'image', productTitle, element: productCard }
      }
      if (element.textContent?.includes('₹')) {
        return { section: 'product', field: 'price', productTitle, element: productCard }
      }
    }

    // Company name detection
    if (textContent === settings?.company?.name || classList.includes('company-name')) {
      return { section: 'settings', field: 'company.name' }
    }

    // Generic text content that might be editable
    if (element.tagName.match(/^H[1-6]$/) || element.tagName === 'P' || element.tagName === 'SPAN') {
      return { section: 'generic', field: 'textContent' }
    }

    return null
  }

  const handleSave = async () => {
    if (!selectedElement || !content) return

    setIsLoading(true)
    try {
      const contentSection = detectContentSection(selectedElement)
      
      if (contentSection) {
        const { section, field } = contentSection

        if (section === 'product') {
          // Handle product updates
          const productTitle = (contentSection as any).productTitle
          const product = products?.find(p => p.name === productTitle)

          if (product) {
            await updateProduct(product.id, {
              [field]: editValue
            })
            toast.success('Product updated successfully!')
          } else {
            toast.error('Product not found')
          }
        } else if (section === 'settings') {
          // Handle settings updates
          if (field === 'company.name') {
            const updatedSettings = {
              ...settings,
              company: {
                ...settings?.company,
                name: editValue
              }
            }
            await updateSettings(updatedSettings)
            toast.success('Company name updated!')
          }
        } else if (section === 'generic') {
          // Handle generic text updates
          selectedElement.textContent = editValue
          toast.success('Text updated!')
        } else {
          // Handle content updates
          const updatedContent = {
            ...content,
            [section]: {
              ...content[section as keyof typeof content],
              [field]: editValue
            }
          }

          await updateContent(updatedContent)
          toast.success('Content updated successfully!')
        }

        // Update the DOM element immediately for visual feedback
        if (editType === 'text') {
          selectedElement.textContent = editValue
        } else if (editType === 'image' && selectedElement.tagName === 'IMG') {
          (selectedElement as HTMLImageElement).src = editValue
        }
      } else {
        // Fallback: just update the element directly
        if (editType === 'text') {
          selectedElement.textContent = editValue
        } else if (editType === 'image' && selectedElement.tagName === 'IMG') {
          (selectedElement as HTMLImageElement).src = editValue
        }
        toast.success('Element updated!')
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to save content:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)
      try {
        console.log('🌍 ContentEditor: Uploading image for global access...')
        const url = await uploadImage(file, 'content')
        setEditValue(url)
        console.log('🌍 ContentEditor: Image uploaded globally, URL:', url)
        toast.success('Image uploaded and available globally!')
      } catch (error: any) {
        console.error('🌍 ContentEditor: Global image upload failed:', error)
        toast.error('Image upload failed - check console for details')
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!selectedElement) return null

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
          className="bg-white rounded-xl shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {editType === 'text' && <Type size={20} className="text-gold" />}
              {editType === 'image' && <ImageIcon size={20} className="text-gold" />}
              {editType === 'link' && <LinkIcon size={20} className="text-gold" />}
              {editType === 'style' && <Palette size={20} className="text-gold" />}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit {editType === 'text' ? 'Text' : editType === 'image' ? 'Image' : editType === 'link' ? 'Link' : 'Style'}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedElement.tagName} element
                </p>
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
          <div className="p-6 space-y-4">
            {editType === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Content
                </label>
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                  placeholder="Enter text content..."
                />
              </div>
            )}

            {editType === 'image' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Enter image URL..."
                  />
                </div>
                
                <div className="text-center">
                  <span className="text-sm text-gray-500">or</span>
                </div>
                
                <div>
                  <label className="flex items-center justify-center w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload size={16} className="mr-2" />
                    <span className="text-sm">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {editValue && (
                  <div className="mt-4">
                    <img
                      src={editValue}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            )}

            {editType === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL
                </label>
                <input
                  type="url"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Enter link URL..."
                />
              </div>
            )}

            {/* Element Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Element Info</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Tag:</strong> {selectedElement.tagName}</div>
                <div><strong>Classes:</strong> {selectedElement.className || 'None'}</div>
                {selectedElement.id && <div><strong>ID:</strong> {selectedElement.id}</div>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ContentEditor
