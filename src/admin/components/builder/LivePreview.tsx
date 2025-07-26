"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useWebsiteBuilder } from '../../contexts/WebsiteBuilderContext'
import { getComponentDefinition } from './ComponentRegistry'
import { ComponentData, PageSection } from '../../contexts/WebsiteBuilderContext'

interface PreviewComponentProps {
  component: ComponentData
  isSelected: boolean
  onSelect: (id: string) => void
  onUpdate: (id: string, data: Partial<ComponentData>) => void
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({ 
  component, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const definition = getComponentDefinition(component.type)
  
  if (!definition) {
    return (
      <div className="p-4 border-2 border-dashed border-red-300 bg-red-50 text-red-600 rounded-lg">
        Unknown component: {component.type}
      </div>
    )
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(component.id)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Enable inline editing for text-based components
    if (component.type === 'text' || component.type === 'heading') {
      setIsEditing(true)
      setEditValue(component.props.content || '')
    }
  }

  const handleEditSubmit = () => {
    onUpdate(component.id, {
      props: { ...component.props, content: editValue }
    })
    setIsEditing(false)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEditSubmit()
    } else if (e.key === 'Escape') {
      handleEditCancel()
    }
  }

  const RenderComponent = definition.renderComponent

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected ? 'ring-2 ring-gold ring-opacity-50' : ''
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-gold bg-opacity-10 pointer-events-none rounded-md" />
      )}
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="absolute inset-0 border-2 border-gold border-opacity-50 rounded-md" />
        <div className="absolute top-0 left-0 bg-gold text-white text-xs px-2 py-1 rounded-br-md">
          {definition.name}
        </div>
      </div>

      {/* Inline Editing */}
      {isEditing ? (
        <div className="relative">
          {component.type === 'text' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleEditSubmit}
              className="w-full p-2 border border-gold rounded-md resize-none"
              autoFocus
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleEditSubmit}
              className="w-full p-2 border border-gold rounded-md"
              autoFocus
            />
          )}
          <div className="absolute top-full left-0 mt-1 text-xs text-gray-500">
            Press Enter to save, Escape to cancel
          </div>
        </div>
      ) : (
        <RenderComponent {...component.props} style={component.styles}>
          {component.children?.map((child) => (
            <PreviewComponent
              key={child.id}
              component={child}
              isSelected={false}
              onSelect={onSelect}
              onUpdate={onUpdate}
            />
          ))}
        </RenderComponent>
      )}
    </div>
  )
}

interface PreviewSectionProps {
  section: PageSection
  isSelected: boolean
  onSelectSection: (id: string) => void
  onSelectComponent: (id: string) => void
  onUpdateComponent: (id: string, data: Partial<ComponentData>) => void
  onDrop: (sectionId: string, componentData: ComponentData, index?: number) => void
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  section,
  isSelected,
  onSelectSection,
  onSelectComponent,
  onUpdateComponent,
  onDrop
}) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'))
      onDrop(section.id, componentData)
    } catch (error) {
      console.error('Failed to parse dropped component data:', error)
    }
  }

  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectSection(section.id)
  }

  if (!section.visible) {
    return null
  }

  return (
    <motion.div
      layout
      className={`relative min-h-[100px] transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      } ${isDragOver ? 'bg-gold bg-opacity-10 border-2 border-dashed border-gold' : ''}`}
      onClick={handleSectionClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={section.styles}
    >
      {/* Section Header */}
      <div className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-br-md">
          {section.name}
        </div>
      </div>

      {/* Section Content */}
      <div className="relative">
        {section.components.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <div className="text-sm font-medium">Empty Section</div>
              <div className="text-xs">Drag components here</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {section.components.map((component) => (
              <PreviewComponent
                key={component.id}
                component={component}
                isSelected={false}
                onSelect={onSelectComponent}
                onUpdate={onUpdateComponent}
              />
            ))}
          </div>
        )}
      </div>

      {/* Drop Zone Indicator */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-gold bg-opacity-20 border-2 border-dashed border-gold rounded-lg">
          <div className="text-gold font-medium">Drop component here</div>
        </div>
      )}
    </motion.div>
  )
}

const LivePreview: React.FC = () => {
  const { state, dispatch, actions } = useWebsiteBuilder()
  const previewRef = useRef<HTMLDivElement>(null)

  const currentPageSections = state.websiteData.pages[state.currentPage] || []

  const handleSelectSection = (sectionId: string) => {
    actions.selectSection(sectionId)
  }

  const handleSelectComponent = (componentId: string) => {
    actions.selectComponent(componentId)
  }

  const handleUpdateComponent = (componentId: string, data: Partial<ComponentData>) => {
    dispatch({ type: 'UPDATE_COMPONENT', payload: { id: componentId, data } })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const handleDropComponent = (sectionId: string, componentData: ComponentData) => {
    dispatch({
      type: 'ADD_COMPONENT',
      payload: { sectionId, component: componentData }
    })
    dispatch({ type: 'SET_DIRTY', payload: true })
  }

  const previewClasses = {
    desktop: 'w-full max-w-none',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto'
  }

  const handleGlobalClick = () => {
    actions.selectComponent(null)
    actions.selectSection(null)
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-auto" onClick={handleGlobalClick}>
      <div className="p-8">
        <motion.div
          ref={previewRef}
          className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
            previewClasses[state.previewMode]
          }`}
          style={{
            minHeight: '100vh',
            transform: state.previewMode === 'mobile' ? 'scale(1)' : 'scale(1)'
          }}
        >
          {/* Preview Content */}
          <div className="relative">
            {currentPageSections.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <div className="text-xl font-medium mb-2">Empty Page</div>
                  <div className="text-sm">Start by adding sections and components</div>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {currentPageSections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <PreviewSection
                      key={section.id}
                      section={section}
                      isSelected={state.selectedSection === section.id}
                      onSelectSection={handleSelectSection}
                      onSelectComponent={handleSelectComponent}
                      onUpdateComponent={handleUpdateComponent}
                      onDrop={handleDropComponent}
                    />
                  ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Preview Info */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Preview: {state.previewMode}</span>
          <span>Page: {state.currentPage}</span>
          {state.selectedComponent && (
            <span className="text-gold">Component selected</span>
          )}
          {state.selectedSection && (
            <span className="text-blue-600">Section selected</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default LivePreview
