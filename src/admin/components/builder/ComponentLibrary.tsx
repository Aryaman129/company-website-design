"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus } from 'lucide-react'
import { 
  componentRegistry, 
  getComponentsByCategory, 
  createComponentData,
  ComponentDefinition 
} from './ComponentRegistry'
import { useWebsiteBuilder } from '../../contexts/WebsiteBuilderContext'

const ComponentLibrary: React.FC = () => {
  const { state, dispatch } = useWebsiteBuilder()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<ComponentDefinition['category'] | 'all'>('all')

  const categories = [
    { id: 'all', name: 'All', count: Object.keys(componentRegistry).length },
    { id: 'layout', name: 'Layout', count: getComponentsByCategory('layout').length },
    { id: 'content', name: 'Content', count: getComponentsByCategory('content').length },
    { id: 'media', name: 'Media', count: getComponentsByCategory('media').length },
    { id: 'form', name: 'Forms', count: getComponentsByCategory('form').length },
    { id: 'navigation', name: 'Navigation', count: getComponentsByCategory('navigation').length }
  ]

  const filteredComponents = Object.values(componentRegistry).filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || component.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleDragStart = (e: React.DragEvent, component: ComponentDefinition) => {
    const componentData = createComponentData(component.id)
    dispatch({ type: 'START_DRAG', payload: componentData })
    
    // Set drag data for external drop zones
    e.dataTransfer.setData('application/json', JSON.stringify(componentData))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragEnd = () => {
    dispatch({ type: 'END_DRAG' })
  }

  const addComponentToPage = (componentId: string) => {
    const componentData = createComponentData(componentId)
    
    // Add to the current page's first section, or create a new section
    const currentPageSections = state.websiteData.pages[state.currentPage]
    
    if (currentPageSections.length === 0) {
      // Create a new section if none exist
      const newSection = {
        id: `section_${Date.now()}`,
        name: 'New Section',
        type: 'custom' as const,
        components: [componentData],
        visible: true,
        order: 0
      }
      
      dispatch({
        type: 'ADD_SECTION',
        payload: {
          page: state.currentPage,
          section: newSection
        }
      })
    } else {
      // Add to the first section
      dispatch({
        type: 'ADD_COMPONENT',
        payload: {
          sectionId: currentPageSections[0].id,
          component: componentData
        }
      })
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                activeCategory === category.id
                  ? 'bg-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-3">
          {filteredComponents.map((component) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                onDragEnd={handleDragEnd}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:border-gold hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gold group-hover:text-white transition-colors">
                      {component.icon ? <component.icon size={16} /> : <div className="w-4 h-4 bg-gray-400 rounded" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{component.name}</h3>
                      <p className="text-sm text-gray-500">{component.description}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addComponentToPage(component.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-gold text-white rounded-md hover:bg-gold-dark transition-all duration-200"
                    title="Add to page"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Component Preview */}
                <div className="bg-gray-50 rounded-md p-3 border">
                  <div className="scale-75 origin-top-left transform">
                    <component.previewComponent {...component.defaultProps} />
                  </div>
                </div>

                {/* Component Info */}
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{component.category}</span>
                  {component.allowChildren && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Container
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No components match "${searchTerm}"`
                : `No components in ${activeCategory} category`
              }
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 mb-2">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addComponentToPage('text')}
            className="flex items-center justify-center space-x-2 p-2 bg-white border border-gray-200 rounded-md hover:border-gold hover:bg-gold hover:text-white transition-colors text-sm"
          >
            <Plus size={14} />
            <span>Text</span>
          </button>
          <button
            onClick={() => addComponentToPage('image')}
            className="flex items-center justify-center space-x-2 p-2 bg-white border border-gray-200 rounded-md hover:border-gold hover:bg-gold hover:text-white transition-colors text-sm"
          >
            <Plus size={14} />
            <span>Image</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComponentLibrary
