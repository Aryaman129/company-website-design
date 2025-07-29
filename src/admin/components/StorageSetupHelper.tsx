"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Copy,
  Settings,
  Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

interface StorageSetupHelperProps {
  isOpen: boolean
  onClose: () => void
}

const StorageSetupHelper: React.FC<StorageSetupHelperProps> = ({ isOpen, onClose }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [useLocalStorage, setUseLocalStorage] = useState(
    localStorage.getItem('force_local_storage') === 'true'
  )

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      toast.success(`${label} copied!`)
      setTimeout(() => setCopiedText(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const toggleLocalStorage = () => {
    const newValue = !useLocalStorage
    setUseLocalStorage(newValue)
    localStorage.setItem('force_local_storage', newValue.toString())
    
    if (newValue) {
      toast.success('Switched to local image storage')
    } else {
      toast.success('Switched to Supabase Storage (if configured)')
    }
  }

  if (!isOpen) return null

  return (
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
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Image Storage Setup</h2>
              <p className="text-gray-600">Configure image uploads for your website</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <ImageIcon size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Current Storage Mode</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {useLocalStorage ? 
                    'Using local browser storage (images lost on refresh)' : 
                    'Using Supabase Storage (permanent storage)'
                  }
                </p>
              </div>
              <button
                onClick={toggleLocalStorage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  useLocalStorage 
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {useLocalStorage ? 'Switch to Supabase' : 'Switch to Local'}
              </button>
            </div>
          </div>

          {/* Storage Options */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Local Storage Option */}
            <div className={`border-2 rounded-lg p-4 ${useLocalStorage ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Local Storage</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Works immediately</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>No setup required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={16} className="text-yellow-500" />
                  <span>Images lost on refresh</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={16} className="text-yellow-500" />
                  <span>Not suitable for production</span>
                </div>
              </div>
            </div>

            {/* Supabase Storage Option */}
            <div className={`border-2 rounded-lg p-4 ${!useLocalStorage ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Supabase Storage</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Permanent storage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Production ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Global CDN delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings size={16} className="text-blue-500" />
                  <span>Requires setup</span>
                </div>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          {!useLocalStorage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Supabase Storage Setup</h4>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <strong>Step 1:</strong> Go to your Supabase dashboard → Storage
                </div>
                <div>
                  <strong>Step 2:</strong> Click "Create Bucket"
                </div>
                <div>
                  <strong>Step 3:</strong> Enter these settings:
                  <div className="bg-white rounded p-2 mt-1 font-mono text-xs">
                    Name: website-images<br/>
                    Public: ✓ (checked)<br/>
                    MIME types: image/jpeg, image/png, image/gif, image/webp<br/>
                    Size limit: 5242880 (5MB)
                  </div>
                </div>
                <div>
                  <strong>Step 4:</strong> Go to Storage → Policies → Create Policy
                </div>
                <div>
                  <strong>Step 5:</strong> Create these 4 policies for "website-images" bucket:
                  <div className="bg-white rounded p-2 mt-1 text-xs">
                    • INSERT policy: Allow public uploads (policy: true)<br/>
                    • SELECT policy: Allow public downloads (policy: true)<br/>
                    • UPDATE policy: Allow public updates (policy: true)<br/>
                    • DELETE policy: Allow public deletes (policy: true)
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-4">
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Open Supabase</span>
                </a>
                
                <button
                  onClick={() => copyToClipboard('website-images', 'Bucket name')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Copy size={16} />
                  <span>{copiedText === 'Bucket name' ? 'Copied!' : 'Copy bucket name'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Test */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Test Your Setup</h4>
            <p className="text-sm text-gray-600 mb-3">
              After setup, try uploading an image in the Visual Builder or Product Management to test if it works.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  onClose()
                  window.open('/admin/builder', '_blank')
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Test in Visual Builder
              </button>
              <button
                onClick={() => {
                  onClose()
                  window.open('/admin/products', '_blank')
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test in Products
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default StorageSetupHelper
