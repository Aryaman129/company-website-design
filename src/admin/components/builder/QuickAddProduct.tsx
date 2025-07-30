"use client"

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Save, Upload } from 'lucide-react'
import { useWebsiteData } from '../../../hooks/useWebsiteData'
import { useCategories } from '../../../hooks/useCategories'
import { uploadImage } from '../../../lib/imageUpload'
import toast from 'react-hot-toast'

interface QuickAddProductProps {
  isOpen: boolean
  onClose: () => void
}

const QuickAddProduct: React.FC<QuickAddProductProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useWebsiteData()
  const { getActiveCategories } = useCategories()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    price: '',
    featured: false
  })

  // Get categories for product creation (exclude "All" since it's not a real category) - memoized
  const categories = useMemo(() => {
    const activeCategories = getActiveCategories()
    return activeCategories.filter(cat => cat.name !== "All").map(cat => cat.name)
  }, [getActiveCategories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await addProduct({
        ...formData,
        features: [],
        specifications: {},
        inStock: true
      })
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        image: '',
        price: '',
        featured: false
      })
      
      onClose()
      toast.success('Product added successfully!')
    } catch (error) {
      console.error('Failed to add product:', error)
      toast.error('Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLoading(true)
      try {
        console.log('🌍 QuickAddProduct: Uploading image for global access...')
        const url = await uploadImage(file, 'products')
        setFormData(prev => ({ ...prev, image: url }))
        console.log('🌍 QuickAddProduct: Image uploaded globally, URL:', url)
        toast.success('Image uploaded and available globally!')
      } catch (error) {
        console.error('🌍 QuickAddProduct: Global image upload failed:', error)
        toast.error('Image upload failed - check console for details')
      } finally {
        setLoading(false)
      }
    }
  }

  if (!isOpen) return null

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
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Plus size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Add Product</h3>
                <p className="text-sm text-gray-500">Add a new product to your website</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                placeholder="Enter product description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="e.g., ₹65/kg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Enter image URL"
                />
                <div className="text-center">
                  <span className="text-sm text-gray-500">or</span>
                </div>
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
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border mt-2"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                Mark as featured product
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-gold hover:bg-gold-dark text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{loading ? 'Adding...' : 'Add Product'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QuickAddProduct
