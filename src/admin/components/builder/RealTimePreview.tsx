"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useWebsiteData } from '../../../hooks/useWebsiteData'
import { eventBus, EVENTS } from '../../../lib/eventBus'

// Import actual website components
import Home from '../../../spa-pages/Home'
import Products from '../../../spa-pages/Products'
import About from '../../../spa-pages/About'
import Contact from '../../../spa-pages/Contact'

interface RealTimePreviewProps {
  currentPage: string
  previewMode: 'desktop' | 'tablet' | 'mobile'
  onElementSelect?: (element: HTMLElement, data: any) => void
}

const RealTimePreview: React.FC<RealTimePreviewProps> = ({
  currentPage,
  previewMode,
  onElementSelect
}) => {
  const { products, content, settings, media, loading } = useWebsiteData()
  const [isEditing, setIsEditing] = useState(false)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Preview dimensions based on mode
  const previewClasses = {
    desktop: 'w-full max-w-none',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto'
  }

  // Enable editing mode for elements
  const enableEditMode = () => {
    if (!previewRef.current) return

    const editableElements = previewRef.current.querySelectorAll(
      'h1, h2, h3, h4, h5, h6, p, span, button, a, img, .hero-title, .hero-subtitle, .product-card h3, .product-card p'
    )

    editableElements.forEach((element) => {
      const htmlElement = element as HTMLElement

      // Add visual indicators for editable elements
      htmlElement.style.position = 'relative'
      htmlElement.style.cursor = 'pointer'

      // Create edit overlay
      const editOverlay = document.createElement('div')
      editOverlay.className = 'edit-overlay'
      editOverlay.style.cssText = `
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px dashed #D4AF37;
        background: rgba(212, 175, 55, 0.1);
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 1000;
      `

      htmlElement.addEventListener('mouseenter', () => {
        if (isEditing) {
          htmlElement.appendChild(editOverlay)
          editOverlay.style.opacity = '1'

          // Add edit icon
          const editIcon = document.createElement('div')
          editIcon.innerHTML = '✏️'
          editIcon.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #D4AF37;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            z-index: 1001;
          `
          editOverlay.appendChild(editIcon)
        }
      })

      htmlElement.addEventListener('mouseleave', () => {
        if (isEditing && editOverlay.parentNode) {
          editOverlay.style.opacity = '0'
          setTimeout(() => {
            if (editOverlay.parentNode) {
              editOverlay.parentNode.removeChild(editOverlay)
            }
          }, 200)
        }
      })

      htmlElement.addEventListener('click', (e) => {
        if (isEditing) {
          e.preventDefault()
          e.stopPropagation()
          setSelectedElement(htmlElement)
          onElementSelect?.(htmlElement, {
            tagName: htmlElement.tagName,
            textContent: htmlElement.textContent,
            innerHTML: htmlElement.innerHTML,
            className: htmlElement.className,
            id: htmlElement.id
          })
        }
      })
    })
  }

  // Disable editing mode
  const disableEditMode = () => {
    if (!previewRef.current) return

    const editableElements = previewRef.current.querySelectorAll('*')
    editableElements.forEach((element) => {
      const htmlElement = element as HTMLElement
      htmlElement.style.outline = 'none'
    })
    setSelectedElement(null)
  }

  // Toggle editing mode
  useEffect(() => {
    if (isEditing) {
      enableEditMode()
    } else {
      disableEditMode()
    }
  }, [isEditing, currentPage, content, products])

  // Listen for data updates and refresh preview
  useEffect(() => {
    const handleDataUpdate = (updateData: any) => {
      // Force re-render when data changes
      if (previewRef.current) {
        console.log('Data updated, refreshing preview...', updateData)

        // Re-enable edit mode if it was active
        if (isEditing) {
          setTimeout(() => {
            enableEditMode()
          }, 100)
        }
      }
    }

    const handleReconnection = () => {
      console.log('Database reconnected, refreshing preview...')
      // Force a complete refresh when database reconnects
      window.location.reload()
    }

    eventBus.on(EVENTS.DATA_UPDATED, handleDataUpdate)
    eventBus.on('database_reconnected', handleReconnection)

    return () => {
      eventBus.off(EVENTS.DATA_UPDATED, handleDataUpdate)
      eventBus.off('database_reconnected', handleReconnection)
    }
  }, [isEditing])

  // Render the appropriate page component
  const renderPageComponent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )
    }

    switch (currentPage) {
      case 'home':
        return <Home />
      case 'products':
        return <Products />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      default:
        return <Home />
    }
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-auto">
      {/* Preview Controls */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Preview Mode: {previewMode}
            </span>
            <span className="text-sm text-gray-500">
              Page: {currentPage}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                isEditing
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isEditing ? 'Exit Edit Mode' : 'Enable Editing'}
            </button>
            
            <button
              onClick={() => window.open(`http://localhost:3000/${currentPage === 'home' ? '' : currentPage}`, '_blank')}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              View Live Site
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-8">
        <motion.div
          ref={previewRef}
          className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
            previewClasses[previewMode]
          }`}
          style={{
            minHeight: '100vh',
            transform: previewMode === 'mobile' ? 'scale(1)' : 'scale(1)'
          }}
        >
          {/* Editing Overlay */}
          {isEditing && (
            <div className="absolute inset-0 z-50 pointer-events-none">
              <div className="absolute top-4 left-4 bg-gold text-white px-3 py-1 rounded-md text-sm font-medium">
                Edit Mode Active - Click elements to edit
              </div>
            </div>
          )}

          {/* Real Website Content */}
          <div className={isEditing ? 'relative z-10' : ''}>
            {renderPageComponent()}
          </div>
        </motion.div>
      </div>

      {/* Selected Element Info */}
      {selectedElement && isEditing && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
          <h4 className="font-medium text-gray-900 mb-2">Selected Element</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Tag:</strong> {selectedElement.tagName}</div>
            <div><strong>Class:</strong> {selectedElement.className || 'None'}</div>
            <div><strong>Text:</strong> {selectedElement.textContent?.slice(0, 50)}...</div>
          </div>
          <button
            onClick={() => setSelectedElement(null)}
            className="mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Deselect
          </button>
        </div>
      )}
    </div>
  )
}

export default RealTimePreview
