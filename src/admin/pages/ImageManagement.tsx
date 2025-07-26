"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Trash2, Edit, Eye, Download, Upload, Video } from "lucide-react"
import MediaUpload from "../components/ImageUpload"
import { useWebsiteData } from "../../hooks/useWebsiteData"
import toast from "react-hot-toast"

const ImageManagement = () => {
  const { media, uploadMedia, deleteMedia, loading } = useWebsiteData()
  const [filteredMedia, setFilteredMedia] = useState(media)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [showUpload, setShowUpload] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])

  const categories = ["All", "Products", "Hero", "About", "Testimonials", "Logos", "Backgrounds", "General"]
  const types = ["All", "Image", "Video"]

  useEffect(() => {
    filterMedia()
  }, [media, searchTerm, selectedCategory, selectedType])

  const filterMedia = () => {
    let filtered = media

    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedType !== "All") {
      filtered = filtered.filter(item =>
        selectedType === "Image" ? item.type === 'image' : item.type === 'video'
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.alt && item.alt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredMedia(filtered)
  }

  const handleUpload = async (files: File[]) => {
    try {
      await uploadMedia(files, selectedCategory === "All" ? "general" : selectedCategory.toLowerCase())
      setShowUpload(false)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleDelete = async (mediaId: string) => {
    if (window.confirm("Are you sure you want to delete this media file?")) {
      try {
        await deleteMedia(mediaId)
        setSelectedMedia(prev => prev.filter(id => id !== mediaId))
      } catch (error) {
        console.error('Delete failed:', error)
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedMedia.length === 0) {
      toast.error("Please select media files to delete")
      return
    }

    if (window.confirm(`Are you sure you want to delete ${selectedMedia.length} media file(s)?`)) {
      try {
        await Promise.all(selectedMedia.map(id => deleteMedia(id)))
        setSelectedMedia([])
      } catch (error) {
        console.error('Bulk delete failed:', error)
      }
    }
  }

  const toggleMediaSelection = (mediaId: string) => {
    setSelectedMedia(prev =>
      prev.includes(mediaId)
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Management</h1>
          <p className="text-gray-600 mt-2">Upload and manage your website images and videos</p>
        </div>
        <motion.button
          onClick={() => setShowUpload(!showUpload)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <Upload size={16} />
          <span>Upload Media</span>
        </motion.button>
      </div>

      {/* Upload Section */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Media</h2>
            <MediaUpload
              onUpload={handleUpload}
              allowVideo={true}
              maxSize={50}
              category={selectedCategory === "All" ? "general" : selectedCategory.toLowerCase()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search media..."
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

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {selectedMedia.length > 0 && (
            <motion.button
              onClick={handleBulkDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
            >
              <Trash2 size={16} />
              <span>Delete Selected ({selectedMedia.length})</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredMedia.map((mediaItem, index) => (
            <motion.div
              key={mediaItem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
            >
              <div className="relative">
                {mediaItem.type === 'image' ? (
                  <img
                    src={mediaItem.url}
                    alt={mediaItem.alt || mediaItem.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-600">Video File</p>
                    </div>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <button
                      onClick={() => window.open(mediaItem.url, '_blank')}
                      className="w-8 h-8 bg-white text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(mediaItem.id)}
                      className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(mediaItem.id)}
                    onChange={() => toggleMediaSelection(mediaItem.id)}
                    className="w-4 h-4 text-gold bg-white border-gray-300 rounded focus:ring-gold focus:ring-2"
                  />
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-gold text-white text-xs font-medium rounded-full">
                    {mediaItem.category}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{mediaItem.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{mediaItem.alt || 'No description'}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>{formatFileSize(mediaItem.size)}</span>
                  <span>{new Date(mediaItem.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    mediaItem.type === 'image'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {mediaItem.type === 'image' ? 'Image' : 'Video'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredMedia.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media files found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria, or upload some media files</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading media files...</p>
        </div>
      )}
    </div>
  )
}

export default ImageManagement
