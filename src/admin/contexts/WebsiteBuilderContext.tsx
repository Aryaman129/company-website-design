"use client"

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { toast } from 'react-hot-toast'

// Types for the website builder
export interface ComponentData {
  id: string
  type: string
  props: Record<string, any>
  children?: ComponentData[]
  styles?: Record<string, any>
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

export interface PageSection {
  id: string
  name: string
  type: 'hero' | 'about' | 'products' | 'testimonials' | 'cta' | 'custom'
  components: ComponentData[]
  styles?: Record<string, any>
  visible: boolean
  order: number
}

export interface WebsiteData {
  pages: {
    home: PageSection[]
    about: PageSection[]
    products: PageSection[]
    contact: PageSection[]
  }
  theme: {
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
      [key: string]: string
    }
    fonts: {
      primary: string
      secondary: string
      sizes: Record<string, string>
    }
    spacing: Record<string, string>
    borderRadius: Record<string, string>
  }
  media: {
    images: Array<{
      id: string
      url: string
      alt: string
      category: string
      tags: string[]
    }>
    videos: Array<{
      id: string
      url: string
      thumbnail: string
      category: string
      tags: string[]
    }>
  }
  settings: {
    seo: Record<string, any>
    navigation: Array<{
      id: string
      label: string
      url: string
      order: number
      visible: boolean
    }>
    forms: Array<{
      id: string
      name: string
      fields: Array<{
        id: string
        type: string
        label: string
        required: boolean
        options?: string[]
      }>
    }>
  }
}

export interface BuilderState {
  websiteData: WebsiteData
  currentPage: keyof WebsiteData['pages']
  selectedComponent: string | null
  selectedSection: string | null
  previewMode: 'desktop' | 'tablet' | 'mobile'
  editMode: 'visual' | 'code'
  isDragging: boolean
  draggedComponent: ComponentData | null
  history: WebsiteData[]
  historyIndex: number
  isPreviewOpen: boolean
  isDirty: boolean
}

type BuilderAction =
  | { type: 'SET_CURRENT_PAGE'; payload: keyof WebsiteData['pages'] }
  | { type: 'SELECT_COMPONENT'; payload: string | null }
  | { type: 'SELECT_SECTION'; payload: string | null }
  | { type: 'SET_PREVIEW_MODE'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'SET_EDIT_MODE'; payload: 'visual' | 'code' }
  | { type: 'START_DRAG'; payload: ComponentData }
  | { type: 'END_DRAG' }
  | { type: 'UPDATE_COMPONENT'; payload: { id: string; data: Partial<ComponentData> } }
  | { type: 'ADD_COMPONENT'; payload: { sectionId: string; component: ComponentData; index?: number } }
  | { type: 'REMOVE_COMPONENT'; payload: { sectionId: string; componentId: string } }
  | { type: 'UPDATE_SECTION'; payload: { id: string; data: Partial<PageSection> } }
  | { type: 'ADD_SECTION'; payload: { page: keyof WebsiteData['pages']; section: PageSection; index?: number } }
  | { type: 'REMOVE_SECTION'; payload: { page: keyof WebsiteData['pages']; sectionId: string } }
  | { type: 'REORDER_SECTIONS'; payload: { page: keyof WebsiteData['pages']; sections: PageSection[] } }
  | { type: 'UPDATE_THEME'; payload: Partial<WebsiteData['theme']> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<WebsiteData['settings']> }
  | { type: 'TOGGLE_PREVIEW'; payload?: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SAVE_STATE' }
  | { type: 'LOAD_DATA'; payload: WebsiteData }
  | { type: 'SET_DIRTY'; payload: boolean }

const initialWebsiteData: WebsiteData = {
  pages: {
    home: [
      {
        id: 'hero-section',
        name: 'Hero Section',
        type: 'hero',
        components: [
          {
            id: 'hero-heading',
            type: 'heading',
            props: {
              content: 'Premium Steel & Metal Solutions',
              level: 'h1',
              className: 'text-4xl md:text-6xl font-bold text-white text-center mb-6'
            },
            children: [],
            styles: {}
          },
          {
            id: 'hero-text',
            type: 'text',
            props: {
              content: 'Leading steel and metal trading company in Maharashtra. Supplying quality materials for construction and industrial projects since 1985.',
              tag: 'p',
              className: 'text-xl text-gray-200 text-center max-w-2xl mx-auto mb-8'
            },
            children: [],
            styles: {}
          },
          {
            id: 'hero-button',
            type: 'button',
            props: {
              text: 'Explore Products',
              variant: 'primary',
              size: 'lg',
              href: '/products'
            },
            children: [],
            styles: {}
          }
        ],
        styles: {
          backgroundColor: '#2D2D2D',
          backgroundImage: 'linear-gradient(135deg, #2D2D2D 0%, #1A1A1A 100%)',
          padding: '6rem 2rem',
          textAlign: 'center'
        },
        visible: true,
        order: 0
      }
    ],
    about: [],
    products: [],
    contact: []
  },
  theme: {
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
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px'
    }
  },
  media: {
    images: [],
    videos: []
  },
  settings: {
    seo: {},
    navigation: [
      { id: '1', label: 'Home', url: '/', order: 1, visible: true },
      { id: '2', label: 'About', url: '/about', order: 2, visible: true },
      { id: '3', label: 'Products', url: '/products', order: 3, visible: true },
      { id: '4', label: 'Contact', url: '/contact', order: 4, visible: true }
    ],
    forms: []
  }
}

const initialState: BuilderState = {
  websiteData: initialWebsiteData,
  currentPage: 'home',
  selectedComponent: null,
  selectedSection: null,
  previewMode: 'desktop',
  editMode: 'visual',
  isDragging: false,
  draggedComponent: null,
  history: [initialWebsiteData],
  historyIndex: 0,
  isPreviewOpen: false,
  isDirty: false
}

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload, selectedComponent: null, selectedSection: null }

    case 'SELECT_COMPONENT':
      return { ...state, selectedComponent: action.payload }

    case 'SELECT_SECTION':
      return { ...state, selectedSection: action.payload, selectedComponent: null }

    case 'SET_PREVIEW_MODE':
      return { ...state, previewMode: action.payload }

    case 'SET_EDIT_MODE':
      return { ...state, editMode: action.payload }

    case 'START_DRAG':
      return { ...state, isDragging: true, draggedComponent: action.payload }

    case 'END_DRAG':
      return { ...state, isDragging: false, draggedComponent: null }

    case 'UPDATE_COMPONENT': {
      const newWebsiteData = { ...state.websiteData }
      const currentPageSections = newWebsiteData.pages[state.currentPage]

      for (const section of currentPageSections) {
        const componentIndex = section.components.findIndex(c => c.id === action.payload.id)
        if (componentIndex !== -1) {
          section.components[componentIndex] = {
            ...section.components[componentIndex],
            ...action.payload.data
          }
          break
        }
      }

      return { ...state, websiteData: newWebsiteData, isDirty: true }
    }

    case 'ADD_COMPONENT': {
      const newWebsiteData = { ...state.websiteData }
      const currentPageSections = newWebsiteData.pages[state.currentPage]
      const section = currentPageSections.find(s => s.id === action.payload.sectionId)

      if (section) {
        const index = action.payload.index ?? section.components.length
        section.components.splice(index, 0, action.payload.component)
      }

      return { ...state, websiteData: newWebsiteData, isDirty: true }
    }

    case 'REMOVE_COMPONENT': {
      const newWebsiteData = { ...state.websiteData }
      const currentPageSections = newWebsiteData.pages[state.currentPage]
      const section = currentPageSections.find(s => s.id === action.payload.sectionId)

      if (section) {
        section.components = section.components.filter(c => c.id !== action.payload.componentId)
      }

      return {
        ...state,
        websiteData: newWebsiteData,
        selectedComponent: state.selectedComponent === action.payload.componentId ? null : state.selectedComponent,
        isDirty: true
      }
    }

    case 'UPDATE_SECTION': {
      const newWebsiteData = { ...state.websiteData }
      const currentPageSections = newWebsiteData.pages[state.currentPage]
      const sectionIndex = currentPageSections.findIndex(s => s.id === action.payload.id)

      if (sectionIndex !== -1) {
        currentPageSections[sectionIndex] = {
          ...currentPageSections[sectionIndex],
          ...action.payload.data
        }
      }

      return { ...state, websiteData: newWebsiteData, isDirty: true }
    }

    case 'ADD_SECTION': {
      const newWebsiteData = { ...state.websiteData }
      const currentPageSections = newWebsiteData.pages[action.payload.page]
      const index = action.payload.index ?? currentPageSections.length

      currentPageSections.splice(index, 0, action.payload.section)

      return { ...state, websiteData: newWebsiteData, isDirty: true }
    }

    case 'REMOVE_SECTION': {
      const newWebsiteData = { ...state.websiteData }
      const currentPageSections = newWebsiteData.pages[action.payload.page]

      newWebsiteData.pages[action.payload.page] = currentPageSections.filter(s => s.id !== action.payload.sectionId)

      return {
        ...state,
        websiteData: newWebsiteData,
        selectedSection: state.selectedSection === action.payload.sectionId ? null : state.selectedSection,
        isDirty: true
      }
    }

    case 'REORDER_SECTIONS': {
      const newWebsiteData = { ...state.websiteData }
      newWebsiteData.pages[action.payload.page] = action.payload.sections.map((section, index) => ({
        ...section,
        order: index
      }))

      return { ...state, websiteData: newWebsiteData, isDirty: true }
    }

    case 'UPDATE_THEME':
      return {
        ...state,
        websiteData: {
          ...state.websiteData,
          theme: { ...state.websiteData.theme, ...action.payload }
        },
        isDirty: true
      }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        websiteData: {
          ...state.websiteData,
          settings: { ...state.websiteData.settings, ...action.payload }
        },
        isDirty: true
      }

    case 'TOGGLE_PREVIEW':
      return { ...state, isPreviewOpen: action.payload ?? !state.isPreviewOpen }

    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload }

    case 'UNDO':
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1
        return {
          ...state,
          websiteData: state.history[newIndex],
          historyIndex: newIndex,
          isDirty: true
        }
      }
      return state

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1
        return {
          ...state,
          websiteData: state.history[newIndex],
          historyIndex: newIndex,
          isDirty: true
        }
      }
      return state

    case 'SAVE_STATE':
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(state.websiteData)
      return {
        ...state,
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49),
        isDirty: false
      }

    case 'LOAD_DATA':
      return {
        ...state,
        websiteData: action.payload,
        history: [action.payload],
        historyIndex: 0,
        isDirty: false
      }

    default:
      return state
  }
}

interface WebsiteBuilderContextType {
  state: BuilderState
  dispatch: React.Dispatch<BuilderAction>
  actions: {
    setCurrentPage: (page: keyof WebsiteData['pages']) => void
    selectComponent: (id: string | null) => void
    selectSection: (id: string | null) => void
    setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void
    setEditMode: (mode: 'visual' | 'code') => void
    togglePreview: (open?: boolean) => void
    undo: () => void
    redo: () => void
    saveState: () => void
    loadData: (data: WebsiteData) => void
  }
}

const WebsiteBuilderContext = createContext<WebsiteBuilderContextType | undefined>(undefined)

export const WebsiteBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState)

  // Auto-save functionality
  useEffect(() => {
    if (state.isDirty) {
      const timer = setTimeout(() => {
        // Auto-save logic here
        localStorage.setItem('website-builder-data', JSON.stringify(state.websiteData))
        dispatch({ type: 'SET_DIRTY', payload: false })
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state.isDirty, state.websiteData])

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('website-builder-data')
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        dispatch({ type: 'LOAD_DATA', payload: data })
      } catch (error) {
        console.error('Failed to load saved data:', error)
      }
    }
  }, [])

  const actions = {
    setCurrentPage: useCallback((page: keyof WebsiteData['pages']) => {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: page })
    }, []),
    
    selectComponent: useCallback((id: string | null) => {
      dispatch({ type: 'SELECT_COMPONENT', payload: id })
    }, []),
    
    selectSection: useCallback((id: string | null) => {
      dispatch({ type: 'SELECT_SECTION', payload: id })
    }, []),
    
    setPreviewMode: useCallback((mode: 'desktop' | 'tablet' | 'mobile') => {
      dispatch({ type: 'SET_PREVIEW_MODE', payload: mode })
    }, []),
    
    setEditMode: useCallback((mode: 'visual' | 'code') => {
      dispatch({ type: 'SET_EDIT_MODE', payload: mode })
    }, []),
    
    togglePreview: useCallback((open?: boolean) => {
      dispatch({ type: 'TOGGLE_PREVIEW', payload: open })
    }, []),
    
    undo: useCallback(() => {
      dispatch({ type: 'UNDO' })
      toast.success('Undone')
    }, []),
    
    redo: useCallback(() => {
      dispatch({ type: 'REDO' })
      toast.success('Redone')
    }, []),
    
    saveState: useCallback(() => {
      dispatch({ type: 'SAVE_STATE' })
      toast.success('Changes saved')
    }, []),
    
    loadData: useCallback((data: WebsiteData) => {
      dispatch({ type: 'LOAD_DATA', payload: data })
    }, [])
  }

  return (
    <WebsiteBuilderContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </WebsiteBuilderContext.Provider>
  )
}

export const useWebsiteBuilder = () => {
  const context = useContext(WebsiteBuilderContext)
  if (context === undefined) {
    throw new Error('useWebsiteBuilder must be used within a WebsiteBuilderProvider')
  }
  return context
}
