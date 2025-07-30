"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  GripVertical, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useCategories, Category } from '../../hooks/useCategories'
import toast from 'react-hot-toast'

const CategoriesManagement: React.FC = () => {
  const {
    categories,
    loading: isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    generateSlug
  } = useCategories()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    active: true
  })



  // Handle adding new category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const slug = newCategory.slug || generateSlug(newCategory.name)
      const categoryData = {
        ...newCategory,
        slug,
        display_order: categories.length
      }

      await addCategory(categoryData)
      setNewCategory({ name: '', slug: '', description: '', active: true })
      setShowAddForm(false)
      toast.success('Category added successfully')
    } catch (error) {
      console.error('Failed to add category:', error)
      toast.error('Failed to add category')
    }
  }

  // Handle updating category
  const handleUpdateCategory = async (id: number, updates: Partial<Category>) => {
    try {
      await updateCategory(id, updates)
      setEditingId(null)
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Failed to update category:', error)
      toast.error('Failed to update category')
    }
  }

  // Handle deleting category
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await deleteCategory(id)
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    }
  }

  // Handle reordering
  const moveCategory = async (id: number, direction: 'up' | 'down') => {
    const index = categories.findIndex(cat => cat.id === id)
    if (index === -1) return

    const newCategories = [...categories]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newCategories.length) return

    // Swap categories
    [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]]

    // Update display_order
    newCategories.forEach((cat, idx) => {
      cat.display_order = idx
    })

    try {
      await reorderCategories(newCategories)
      toast.success('Category order updated')
    } catch (error) {
      console.error('Failed to reorder categories:', error)
      toast.error('Failed to update category order')
    }
  }

  // Toggle category active status
  const toggleActive = (id: number) => {
    const category = categories.find(cat => cat.id === id)
    if (category) {
      handleUpdateCategory(id, { active: !category.active })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-1">Manage product categories and their display order</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Add Category Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({
                    ...newCategory,
                    name: e.target.value,
                    slug: generateSlug(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="category-slug"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  rows={3}
                  placeholder="Category description"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={newCategory.active}
                  onChange={(e) => setNewCategory({ ...newCategory, active: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">Active</label>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="flex items-center space-x-2 px-4 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg transition-colors"
              >
                <Save size={16} />
                <span>Add Category</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Categories ({categories.length})</h3>
          <p className="text-sm text-gray-600 mt-1">Drag to reorder, click to edit</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              isEditing={editingId === category.id}
              onEdit={() => setEditingId(category.id)}
              onSave={(updates) => handleUpdateCategory(category.id, updates)}
              onCancel={() => setEditingId(null)}
              onDelete={() => handleDeleteCategory(category.id)}
              onToggleActive={() => toggleActive(category.id)}
              onMoveUp={() => moveCategory(category.id, 'up')}
              onMoveDown={() => moveCategory(category.id, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < categories.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Preview - How categories appear on Products page</h3>
        <div className="flex flex-wrap gap-2">
          {categories.filter(cat => cat.active).map((category) => (
            <div
              key={category.id}
              className="px-4 py-2 bg-gold text-white rounded-full text-sm font-medium"
            >
              {category.name}
            </div>
          ))}
        </div>
        {categories.filter(cat => cat.active).length === 0 && (
          <p className="text-gray-500 italic">No active categories to display</p>
        )}
      </div>
    </div>
  )
}

// Category Row Component
interface CategoryRowProps {
  category: Category
  isEditing: boolean
  onEdit: () => void
  onSave: (updates: Partial<Category>) => void
  onCancel: () => void
  onDelete: () => void
  onToggleActive: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}) => {
  const [editData, setEditData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description || ''
  })

  const handleSave = () => {
    if (!editData.name.trim()) {
      toast.error('Category name is required')
      return
    }
    onSave(editData)
  }

  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={editData.slug}
              onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 mt-4">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-green-600 hover:text-green-800 transition-colors"
          >
            <Save size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col space-y-1">
            {canMoveUp && (
              <button
                onClick={onMoveUp}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowUp size={12} />
              </button>
            )}
            {canMoveDown && (
              <button
                onClick={onMoveDown}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowDown size={12} />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h4 className="font-medium text-gray-900">{category.name}</h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {category.slug}
              </span>
              {!category.active && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleActive}
            className={`p-2 rounded transition-colors ${
              category.active 
                ? 'text-green-600 hover:bg-green-50' 
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title={category.active ? 'Hide category' : 'Show category'}
          >
            {category.active ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit category"
          >
            <Edit2 size={16} />
          </button>
          {category.slug !== 'all' && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete category"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoriesManagement
