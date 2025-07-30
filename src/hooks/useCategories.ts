"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load categories from database
  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (supabaseError) {
        throw supabaseError
      }

      setCategories(data || [])
    } catch (err) {
      console.error('Failed to load categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load categories')
      
      // Fallback to default categories if database fails
      const fallbackCategories: Category[] = [
        { id: 1, name: 'All', slug: 'all', description: 'Show all products', display_order: 0, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 2, name: 'Toughened Glass', slug: 'toughened-glass', description: 'High-strength safety glass products', display_order: 1, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 3, name: 'Wooden Doors', slug: 'wooden-doors', description: 'Premium wooden door solutions', display_order: 2, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 4, name: 'Aluminum Windows', slug: 'aluminum-windows', description: 'Modern aluminum window systems', display_order: 3, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 5, name: 'PVC Panels', slug: 'pvc-panels', description: 'Durable PVC panel solutions', display_order: 4, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 6, name: 'ACP Cladding', slug: 'acp-cladding', description: 'Aluminum composite panel cladding', display_order: 5, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 7, name: 'Steel Structures', slug: 'steel-structures', description: 'Structural steel components', display_order: 6, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 8, name: 'Glass Partitions', slug: 'glass-partitions', description: 'Office and commercial glass partitions', display_order: 7, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' }
      ]
      setCategories(fallbackCategories)
    } finally {
      setLoading(false)
    }
  }

  // Add new category
  const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      setCategories(prev => [...prev, data].sort((a, b) => a.display_order - b.display_order))
      return data
    } catch (err) {
      console.error('Failed to add category:', err)
      throw err
    }
  }

  // Update category
  const updateCategory = async (id: number, updates: Partial<Category>) => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (supabaseError) {
        throw supabaseError
      }

      setCategories(prev => 
        prev.map(cat => cat.id === id ? data : cat)
           .sort((a, b) => a.display_order - b.display_order)
      )
      return data
    } catch (err) {
      console.error('Failed to update category:', err)
      throw err
    }
  }

  // Delete category
  const deleteCategory = async (id: number) => {
    try {
      const { error: supabaseError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (supabaseError) {
        throw supabaseError
      }

      setCategories(prev => prev.filter(cat => cat.id !== id))
    } catch (err) {
      console.error('Failed to delete category:', err)
      throw err
    }
  }

  // Reorder categories
  const reorderCategories = async (reorderedCategories: Category[]) => {
    try {
      // Update display_order for each category individually
      for (let i = 0; i < reorderedCategories.length; i++) {
        const category = reorderedCategories[i]
        const { error: supabaseError } = await supabase
          .from('categories')
          .update({ display_order: i })
          .eq('id', category.id)

        if (supabaseError) {
          throw supabaseError
        }
      }

      setCategories(reorderedCategories)
    } catch (err) {
      console.error('Failed to reorder categories:', err)
      throw err
    }
  }

  // Get active categories only - memoized to prevent re-renders
  const getActiveCategories = useCallback(() => {
    return categories.filter(cat => cat.active)
  }, [categories])

  // Get category by slug - memoized to prevent re-renders
  const getCategoryBySlug = useCallback((slug: string) => {
    return categories.find(cat => cat.slug === slug)
  }, [categories])

  // Generate slug from name - pure function, no dependencies needed
  const generateSlug = useCallback((name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }, [])

  useEffect(() => {
    loadCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    getActiveCategories,
    getCategoryBySlug,
    generateSlug
  }
}
