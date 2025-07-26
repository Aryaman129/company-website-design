"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Star, Package } from "lucide-react"
import { useWebsiteData } from "../../hooks/useWebsiteData"
import ProductEditModal from "../components/ProductEditModal"
import toast from "react-hot-toast"

const ProductManagement = () => {
  const { products, updateProduct, deleteProduct, loading, settings } = useWebsiteData()
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const categories = settings?.categories || [
    "All",
    "Toughened Glass",
    "Wooden Doors",
    "Aluminum Windows",
    "PVC Panels",
    "ACP Cladding",
    "Steel Doors",
    "Glazing Services"
  ]

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const toggleFeatured = async (productId: number) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      try {
        await updateProduct(productId, { featured: !product.featured })
      } catch (error) {
        console.error('Update failed:', error)
      }
    }
  }

  const toggleStock = async (productId: number) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      try {
        await updateProduct(productId, { inStock: !product.inStock })
      } catch (error) {
        console.error('Update failed:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex space-x-2">
                  {product.featured && (
                    <span className="px-2 py-1 bg-gold text-white text-xs font-medium rounded-full flex items-center space-x-1">
                      <Star size={10} />
                      <span>Featured</span>
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                  <span className="text-gold font-bold">{product.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gold/10 text-gold text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{product.features.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleFeatured(product.id)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
                      product.featured
                        ? 'bg-gold text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {product.featured ? 'Featured' : 'Make Featured'}
                  </button>
                  <button
                    onClick={() => toggleStock(product.id)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-colors ${
                      product.inStock
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Product Edit Modal */}
      <ProductEditModal
        product={editingProduct}
        isOpen={showAddForm || editingProduct !== null}
        onClose={() => {
          setShowAddForm(false)
          setEditingProduct(null)
        }}
        onSave={(product) => {
          // The modal handles the actual save operation
          // This callback is just for UI updates
          console.log('Product saved:', product)
        }}
      />
    </div>
  )
}

export default ProductManagement
