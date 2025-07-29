"use client"

import React, { useState, useEffect } from 'react'
import { HardDrive, Cloud, Info } from 'lucide-react'
import toast from 'react-hot-toast'

const StorageToggle: React.FC = () => {
  const [useLocalStorage, setUseLocalStorage] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('force_local_storage')
    setUseLocalStorage(stored !== 'false')
  }, [])

  const toggleStorage = () => {
    const newValue = !useLocalStorage
    setUseLocalStorage(newValue)
    localStorage.setItem('force_local_storage', newValue.toString())
    
    if (newValue) {
      toast.success('Switched to local image storage (development mode)')
    } else {
      toast.success('Switched to Supabase Storage (requires setup)')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${useLocalStorage ? 'bg-yellow-100' : 'bg-green-100'}`}>
            {useLocalStorage ? (
              <HardDrive size={20} className="text-yellow-600" />
            ) : (
              <Cloud size={20} className="text-green-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Image Storage</h3>
            <p className="text-sm text-gray-600">
              {useLocalStorage ? 'Local browser storage (temporary)' : 'Supabase Storage (permanent)'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Info size={16} />
          </button>
          
          <button
            onClick={toggleStorage}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useLocalStorage ? 'bg-yellow-400' : 'bg-green-400'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useLocalStorage ? 'translate-x-1' : 'translate-x-6'
              }`}
            />
          </button>
        </div>
      </div>
      
      {showInfo && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <div className="space-y-2">
            <div>
              <strong className="text-yellow-700">Local Storage:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Works immediately, no setup required</li>
                <li>• Images are lost when you refresh the page</li>
                <li>• Perfect for development and testing</li>
              </ul>
            </div>
            <div>
              <strong className="text-green-700">Supabase Storage:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Permanent image storage</li>
                <li>• Images persist across sessions</li>
                <li>• Requires Supabase Storage bucket setup</li>
                <li>• Recommended for production</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StorageToggle
