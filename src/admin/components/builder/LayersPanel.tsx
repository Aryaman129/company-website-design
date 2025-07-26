"use client"

import React, { useState } from 'react'
import { motion, Reorder } from 'framer-motion'
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Trash2, 
  Copy,
  Plus,
  GripVertical
} from 'lucide-react'
import { useWebsiteBuilder } from '../../contexts/WebsiteBuilderContext'
import { getComponentDefinition } from './ComponentRegistry'
import { PageSection, ComponentData } from '../../contexts/WebsiteBuilderContext'

interface ComponentItemProps {
  component: ComponentData
  sectionId: string
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (sectionId: string, componentId: string) => void
  onDuplicate: (sectionId: string, component: ComponentData) => void
}

const ComponentItem: React.FC<ComponentItemProps> = ({
  component,
  sectionId,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate
}) => {
  const definition = getComponentDefinition(component.type)
  const Icon = definition?.icon

  return (
    <motion.div
      layout
      className={`group flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
        isSelected ? 'bg-gold text-white' : 'hover:bg-gray-100'
      }`}
      onClick={() => onSelect(component.id)}
    >
      <GripVertical size={14} className="text-gray-400 opacity-0 group-hover:opacity-100" />
      
      {Icon && (
        <Icon size={16} className={isSelected ? 'text-white' : 'text-gray-600'} />
      )}
      
      <span className="flex-1 text-sm font-medium truncate">
        {definition?.name || component.type}
      </span>
      
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate(sectionId, component)
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="Duplicate"
        >
          <Copy size={12} />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(sectionId, component.id)
          }}
          className="p-1 hover:bg-red-100 text-red-600 rounded"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  )
}

interface SectionItemProps {
  section: PageSection
  isSelected: boolean
  isExpanded: boolean
  onSelect: (id: string) => void
  onToggleExpanded: (id: string) => void
  onToggleVisibility: (id: string) => void
  onDelete: (id: string) => void
  onSelectComponent: (id: string) => void
  onDeleteComponent: (sectionId: string, componentId: string) => void
  onDuplicateComponent: (sectionId: string, component: ComponentData) => void
  selectedComponentId: string | null
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpanded,
  onToggleVisibility,
  onDelete,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  selectedComponentId
}) => {
  return (
    <div className="space-y-1">
      {/* Section Header */}
      <div
        className={`group flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-50'
        }`}
        onClick={() => onSelect(section.id)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpanded(section.id)
          }}
          className="p-1 hover:bg-gray-200 rounded"
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        <span className="flex-1 text-sm font-medium truncate">
          {section.name}
        </span>
        
        <span className="text-xs text-gray-500">
          {section.components.length}
        </span>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleVisibility(section.id)
            }}
            className={`p-1 rounded ${
              section.visible ? 'text-green-600' : 'text-gray-400'
            }`}
            title={section.visible ? 'Hide section' : 'Show section'}
          >
            {section.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(section.id)
            }}
            className="p-1 hover:bg-red-100 text-red-600 rounded"
            title="Delete section"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      
      {/* Section Components */}
      {isExpanded && (
        <div className="ml-6 space-y-1">
          {section.components.length === 0 ? (
            <div className="text-xs text-gray-500 italic p-2">
              No components
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={section.components}
              onReorder={() => {}} // TODO: Implement reordering
              className="space-y-1"
            >
              {section.components.map((component) => (
                <Reorder.Item key={component.id} value={component}>
                  <ComponentItem
                    component={component}
                    sectionId={section.id}
                    isSelected={selectedComponentId === component.id}
                    onSelect={onSelectComponent}
                    onDelete={onDeleteComponent}
                    onDuplicate={onDuplicateComponent}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </div>
      )}
    </div>
  )
}

const LayersPanel: React.FC = () => {
  const { state, dispatch, actions } = useWebsiteBuilder()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const currentPageSections = state.websiteData.pages[state.currentPage] || []

  const handleSelectSection = (sectionId: string) => {
    actions.selectSection(sectionId)
  }

  const handleSelectComponent = (componentId: string) => {
    actions.selectComponent(componentId)
  }

  const handleToggleExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleToggleVisibility = (sectionId: string) => {
    const section = currentPageSections.find(s => s.id === sectionId)
    if (section) {
      dispatch({
        type: 'UPDATE_SECTION',
        payload: {
          id: sectionId,
          data: { visible: !section.visible }
        }
      })
      dispatch({ type: 'SET_DIRTY', payload: true })
    }
  }

  const handleDeleteSection = (sectionId: string) => {
    dispatch({
      type: 'REMOVE_SECTION',
      payload: {
        page: state.currentPage,
        sectionId
      }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const handleDeleteComponent = (sectionId: string, componentId: string) => {
    dispatch({
      type: 'REMOVE_COMPONENT',
      payload: { sectionId, componentId }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const handleDuplicateComponent = (sectionId: string, component: ComponentData) => {
    const duplicatedComponent = {
      ...component,
      id: `${component.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    dispatch({
      type: 'ADD_COMPONENT',
      payload: { sectionId, component: duplicatedComponent }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const handleAddSection = () => {
    const newSection: PageSection = {
      id: `section_${Date.now()}`,
      name: 'New Section',
      type: 'custom',
      components: [],
      visible: true,
      order: currentPageSections.length
    }
    
    dispatch({
      type: 'ADD_SECTION',
      payload: {
        page: state.currentPage,
        section: newSection
      }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Page Structure</h3>
          <button
            onClick={handleAddSection}
            className="flex items-center space-x-1 px-2 py-1 bg-gold text-white text-sm rounded-md hover:bg-gold-dark transition-colors"
          >
            <Plus size={14} />
            <span>Section</span>
          </button>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          Page: {state.currentPage} ({currentPageSections.length} sections)
        </div>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentPageSections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections</h3>
            <p className="text-gray-600 mb-4">
              Start by adding a section to your page
            </p>
            <button
              onClick={handleAddSection}
              className="px-4 py-2 bg-gold text-white rounded-md hover:bg-gold-dark transition-colors"
            >
              Add Section
            </button>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={currentPageSections}
            onReorder={() => {}} // TODO: Implement section reordering
            className="space-y-2"
          >
            {currentPageSections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <Reorder.Item key={section.id} value={section}>
                  <SectionItem
                    section={section}
                    isSelected={state.selectedSection === section.id}
                    isExpanded={expandedSections.has(section.id)}
                    onSelect={handleSelectSection}
                    onToggleExpanded={handleToggleExpanded}
                    onToggleVisibility={handleToggleVisibility}
                    onDelete={handleDeleteSection}
                    onSelectComponent={handleSelectComponent}
                    onDeleteComponent={handleDeleteComponent}
                    onDuplicateComponent={handleDuplicateComponent}
                    selectedComponentId={state.selectedComponent}
                  />
                </Reorder.Item>
              ))}
          </Reorder.Group>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Total components: {currentPageSections.reduce((acc, section) => acc + section.components.length, 0)}</span>
            <span>Visible sections: {currentPageSections.filter(s => s.visible).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LayersPanel
