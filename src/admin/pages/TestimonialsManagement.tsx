"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Trash2, Star, User } from "lucide-react"
import { useWebsiteData } from "../../hooks/useWebsiteData"
import toast from "react-hot-toast"

const TestimonialsManagement = () => {
  const { content, addTestimonial, updateTestimonial, deleteTestimonial, loading } = useWebsiteData()
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    text: '',
    rating: 5,
    image: '/placeholder-user.jpg'
  })

  const testimonials = content?.testimonials || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, formData)
        setEditingTestimonial(null)
      } else {
        await addTestimonial(formData)
      }
      
      setFormData({
        name: '',
        company: '',
        text: '',
        rating: 5,
        image: '/placeholder-user.jpg'
      })
      setShowForm(false)
    } catch (error) {
      console.error('Submit failed:', error)
    }
  }

  const handleEdit = (testimonial: any) => {
    setFormData({
      name: testimonial.name,
      company: testimonial.company,
      text: testimonial.text,
      rating: testimonial.rating,
      image: testimonial.image || '/placeholder-user.jpg'
    })
    setEditingTestimonial(testimonial)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id)
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      company: '',
      text: '',
      rating: 5,
      image: '/placeholder-user.jpg'
    })
    setEditingTestimonial(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600 mt-2">Manage customer testimonials and reviews</p>
        </div>
        <motion.button
          onClick={() => setShowForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonial Text
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image || '/placeholder-user.jpg'}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gold">{testimonial.company}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-gold fill-current" size={16} />
                ))}
              </div>

              <p className="text-gray-600 text-sm italic">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
          <p className="text-gray-600">Add your first customer testimonial to get started</p>
        </div>
      )}
    </div>
  )
}

export default TestimonialsManagement
