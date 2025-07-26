"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Save, Loader } from 'lucide-react'
import { useWebsiteData } from '../../hooks/useWebsiteData'
import { Product } from '../../lib/dataManager'
import toast from 'react-hot-toast'

interface ProductEditModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const { addProduct, updateProduct, settings } = useWebsiteData()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    description: '',
    image: '',
    features: [],
    price: '',
    specifications: {},
    inStock: true,
    featured: false
  })

  const categories = settings?.categories || [
    "Steel Pipes",
    "Steel Bars", 
    "Steel Sheets",
    "Stainless Steel",
    "Aluminum",
    "Structural Steel",
    "GI Sheets",
    "Copper"
  ]

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        image: product.image || '',
        features: product.features || [],
        price: product.price || '',
        specifications: product.specifications || {},
        inStock: product.inStock ?? true,
        featured: product.featured ?? false
      })
    } else {
      setFormData({
        name: '',
        category: categories[0] || '',
        description: '',
        image: '',
        features: [],
        price: '',
        specifications: {},
        inStock: true,
        featured: false
      })
    }
  }, [product, categories])

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])]
    newFeatures[index] = value
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), '']
    }))
  }

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])]
    newFeatures.splice(index, 1)
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }))
  }

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }))
  }

  const addSpecification = () => {
    const key = prompt('Enter specification key (e.g., "material", "thickness"):')
    if (key) {
      handleSpecificationChange(key, '')
    }
  }

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications }
    delete newSpecs[key]
    setFormData(prev => ({
      ...prev,
      specifications: newSpecs
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      if (product) {
        // Update existing product
        await updateProduct(product.id, formData)
        onSave({ ...product, ...formData } as Product)
      } else {
        // Add new product
        const newProduct = await addProduct(formData as Omit<Product, 'id'>)
        onSave(newProduct)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a server
      // For now, we'll create a local URL
      const url = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        image: url
      }))
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
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="e.g., ₹65/kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Enter product description"
                    required
                  />
                </div>
              </div>

              {/* Image and Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Image & Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Enter image URL"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">or</span>
                      <label className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                        <Upload size={16} />
                        <span className="text-sm">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => handleInputChange('inStock', e.target.checked)}
                      className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-gray-700">In Stock</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-3 py-1 bg-gold text-white text-sm rounded-md hover:bg-gold-dark transition-colors"
                >
                  Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {(formData.features || []).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Enter feature"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-3 py-1 bg-gold text-white text-sm rounded-md hover:bg-gold-dark transition-colors"
                >
                  Add Specification
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(formData.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={key}
                      readOnly
                      className="w-1/3 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => handleSpecificationChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Enter specification value"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
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
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>{loading ? 'Saving...' : 'Save Product'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProductEditModal
