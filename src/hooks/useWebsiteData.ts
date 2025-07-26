"use client"

import { useState, useEffect, useCallback } from 'react'
import { dataManager, Product, ContentData, SettingsData, MediaItem, Testimonial } from '../lib/dataManager'
import { eventBus, EVENTS } from '../lib/eventBus'
import toast from 'react-hot-toast'

export const useWebsiteData = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [content, setContent] = useState<ContentData | null>(null)
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [productsData, contentData, settingsData, mediaData] = await Promise.all([
        dataManager.getProducts(),
        dataManager.getContent(),
        dataManager.getSettings(),
        dataManager.getMedia()
      ])
      
      setProducts(productsData)
      setContent(contentData)
      setSettings(settingsData)
      setMedia(mediaData)
    } catch (err) {
      setError('Failed to load website data')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    // Listen for data updates from admin portal
    const handleDataUpdate = (updateData: { type: string; data: any }) => {
      switch (updateData.type) {
        case 'products':
          setProducts(updateData.data)
          break
        case 'content':
          setContent(updateData.data)
          break
        case 'settings':
          setSettings(updateData.data)
          break
        case 'media':
          setMedia(updateData.data)
          break
      }
    }

    eventBus.on(EVENTS.DATA_UPDATED, handleDataUpdate)

    return () => {
      eventBus.off(EVENTS.DATA_UPDATED, handleDataUpdate)
    }
  }, [loadData])

  // Products methods
  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = await dataManager.addProduct(product)
      setProducts(prev => [newProduct, ...prev])
      toast.success('Product added successfully!')
      return newProduct
    } catch (error) {
      toast.error('Failed to add product')
      throw error
    }
  }, [])

  const updateProduct = useCallback(async (id: number, updates: Partial<Product>) => {
    try {
      await dataManager.updateProduct(id, updates)
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
      toast.success('Product updated successfully!')
    } catch (error) {
      toast.error('Failed to update product')
      throw error
    }
  }, [])

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await dataManager.deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success('Product deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete product')
      throw error
    }
  }, [])

  // Content methods
  const updateContent = useCallback(async (newContent: ContentData) => {
    try {
      await dataManager.saveContent(newContent)
      setContent(newContent)
      toast.success('Content updated successfully!')
    } catch (error) {
      toast.error('Failed to update content')
      throw error
    }
  }, [])

  // Settings methods
  const updateSettings = useCallback(async (newSettings: SettingsData) => {
    try {
      await dataManager.saveSettings(newSettings)
      setSettings(newSettings)
      toast.success('Settings updated successfully!')
    } catch (error) {
      toast.error('Failed to update settings')
      throw error
    }
  }, [])

  // Media methods
  const uploadMedia = useCallback(async (files: File[], category: string = 'general') => {
    try {
      const uploadPromises = files.map(file => dataManager.addMediaItem(file, category))
      const newMediaItems = await Promise.all(uploadPromises)
      setMedia(prev => [...newMediaItems, ...prev])
      toast.success(`${files.length} file(s) uploaded successfully!`)
      return newMediaItems
    } catch (error) {
      toast.error('Failed to upload media')
      throw error
    }
  }, [])

  const deleteMedia = useCallback(async (id: string) => {
    try {
      await dataManager.deleteMediaItem(id)
      setMedia(prev => prev.filter(m => m.id !== id))
      toast.success('Media deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete media')
      throw error
    }
  }, [])

  // Testimonials methods
  const addTestimonial = useCallback(async (testimonial: Omit<Testimonial, 'id'>) => {
    try {
      const newTestimonial = await dataManager.addTestimonial(testimonial)
      if (content) {
        const updatedContent = {
          ...content,
          testimonials: [newTestimonial, ...content.testimonials]
        }
        setContent(updatedContent)
      }
      toast.success('Testimonial added successfully!')
      return newTestimonial
    } catch (error) {
      toast.error('Failed to add testimonial')
      throw error
    }
  }, [content])

  const updateTestimonial = useCallback(async (id: number, updates: Partial<Testimonial>) => {
    try {
      await dataManager.updateTestimonial(id, updates)
      if (content) {
        const updatedContent = {
          ...content,
          testimonials: content.testimonials.map(t => t.id === id ? { ...t, ...updates } : t)
        }
        setContent(updatedContent)
      }
      toast.success('Testimonial updated successfully!')
    } catch (error) {
      toast.error('Failed to update testimonial')
      throw error
    }
  }, [content])

  const deleteTestimonial = useCallback(async (id: number) => {
    try {
      await dataManager.deleteTestimonial(id)
      if (content) {
        const updatedContent = {
          ...content,
          testimonials: content.testimonials.filter(t => t.id !== id)
        }
        setContent(updatedContent)
      }
      toast.success('Testimonial deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete testimonial')
      throw error
    }
  }, [content])

  // Utility methods
  const exportData = useCallback(async () => {
    try {
      const data = await dataManager.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `website-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully!')
    } catch (error) {
      toast.error('Failed to export data')
      throw error
    }
  }, [])

  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text()
      await dataManager.importData(text)
      await loadData() // Reload all data
    } catch (error) {
      toast.error('Failed to import data')
      throw error
    }
  }, [loadData])

  const refreshData = useCallback(() => {
    loadData()
  }, [loadData])

  return {
    // Data
    products,
    content,
    settings,
    media,
    loading,
    error,
    
    // Products
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Content
    updateContent,
    
    // Settings
    updateSettings,
    
    // Media
    uploadMedia,
    deleteMedia,
    
    // Testimonials
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    
    // Utilities
    exportData,
    importData,
    refreshData
  }
}
