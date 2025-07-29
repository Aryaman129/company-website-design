"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Video,
  Map,
  Phone,
  Mail,
  MapPin,
  RefreshCw
} from 'lucide-react'
import VideoTest from '../../components/VideoTest'

interface FixStatus {
  name: string
  status: 'success' | 'error' | 'warning' | 'checking'
  message: string
  details?: string
}

const FixVerification: React.FC = () => {
  const [fixes, setFixes] = useState<FixStatus[]>([
    { name: 'Video Playback', status: 'checking', message: 'Checking video file...' },
    { name: 'Google Maps Embed', status: 'checking', message: 'Verifying map embed...' },
    { name: 'Navigation Contact Info', status: 'checking', message: 'Checking contact info...' },
    { name: 'Address Information', status: 'checking', message: 'Verifying address...' }
  ])
  const [showVideoTest, setShowVideoTest] = useState(false)

  useEffect(() => {
    verifyFixes()
  }, [])

  const verifyFixes = async () => {
    const newFixes: FixStatus[] = []

    // 1. Check Video File
    try {
      const response = await fetch('/Intro.mp4', { method: 'HEAD' })
      if (response.ok) {
        newFixes.push({
          name: 'Video File Availability',
          status: 'success',
          message: 'Intro.mp4 file is accessible',
          details: `File size: ${response.headers.get('content-length')} bytes`
        })
      } else {
        newFixes.push({
          name: 'Video File Availability',
          status: 'error',
          message: 'Intro.mp4 file not found',
          details: `HTTP ${response.status}: ${response.statusText}`
        })
      }
    } catch (error) {
      newFixes.push({
        name: 'Video File Availability',
        status: 'error',
        message: 'Failed to check video file',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // 2. Check Contact Information
    const correctPhone = '+91 9422114130'
    const correctEmail = 'anil.shyamtrading@gmail.com'
    
    // Check if navbar has correct info (simulate by checking if fallback values are updated)
    const navbarElement = document.querySelector('nav')
    if (navbarElement) {
      const hasCorrectPhone = navbarElement.textContent?.includes(correctPhone)
      const hasCorrectEmail = navbarElement.textContent?.includes(correctEmail)
      
      if (hasCorrectPhone && hasCorrectEmail) {
        newFixes.push({
          name: 'Navigation Contact Info',
          status: 'success',
          message: 'Contact information updated correctly',
          details: `Phone: ${correctPhone}, Email: ${correctEmail}`
        })
      } else {
        newFixes.push({
          name: 'Navigation Contact Info',
          status: 'warning',
          message: 'Contact info may not be fully updated',
          details: `Phone found: ${hasCorrectPhone}, Email found: ${hasCorrectEmail}`
        })
      }
    } else {
      newFixes.push({
        name: 'Navigation Contact Info',
        status: 'warning',
        message: 'Navigation element not found',
        details: 'Cannot verify contact info in navbar'
      })
    }

    // 3. Check Google Maps
    const mapIframe = document.querySelector('iframe[title*="Shyam Trading"]')
    if (mapIframe) {
      const src = mapIframe.getAttribute('src')
      if (src?.includes('google.com/maps/embed')) {
        newFixes.push({
          name: 'Google Maps Embed',
          status: 'success',
          message: 'Google Maps embed URL is correct',
          details: 'Using proper embed URL format'
        })
      } else {
        newFixes.push({
          name: 'Google Maps Embed',
          status: 'error',
          message: 'Google Maps using incorrect URL format',
          details: `Current src: ${src}`
        })
      }
    } else {
      newFixes.push({
        name: 'Google Maps Embed',
        status: 'warning',
        message: 'Google Maps iframe not found on current page',
        details: 'Check the Contact page for map embed'
      })
    }

    // 4. Check Address Information
    const correctAddress = 'Hansapuri'
    const addressElements = document.querySelectorAll('*')
    let addressFound = false
    
    addressElements.forEach(el => {
      if (el.textContent?.includes(correctAddress)) {
        addressFound = true
      }
    })

    if (addressFound) {
      newFixes.push({
        name: 'Address Information',
        status: 'success',
        message: 'Address information updated',
        details: 'Found references to Hansapuri address'
      })
    } else {
      newFixes.push({
        name: 'Address Information',
        status: 'warning',
        message: 'Address may not be fully updated',
        details: 'Could not find Hansapuri references on current page'
      })
    }

    setFixes(newFixes)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={20} className="text-green-500" />
      case 'error': return <XCircle size={20} className="text-red-500" />
      case 'warning': return <AlertTriangle size={20} className="text-yellow-500" />
      case 'checking': return <RefreshCw size={20} className="text-blue-500 animate-spin" />
      default: return <AlertTriangle size={20} className="text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'error': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'checking': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Fix Verification</h3>
              <p className="text-sm text-gray-600">Verify all critical issues have been resolved</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowVideoTest(!showVideoTest)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showVideoTest ? 'Hide' : 'Show'} Video Test
            </button>
            <button
              onClick={verifyFixes}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={16} />
              <span>Re-check</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {fixes.map((fix, index) => (
            <motion.div
              key={fix.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusColor(fix.status)}`}
            >
              <div className="flex items-start space-x-3">
                {getStatusIcon(fix.status)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{fix.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{fix.message}</p>
                  {fix.details && (
                    <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 p-2 rounded">
                      {fix.details}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Action Links */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Quick Test Links</h4>
          <div className="flex flex-wrap gap-2">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <Video size={14} />
              <span>Test Home Video</span>
            </a>
            <a
              href="/about"
              target="_blank"
              className="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              <Video size={14} />
              <span>Test About Video</span>
            </a>
            <a
              href="/contact"
              target="_blank"
              className="inline-flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
            >
              <Map size={14} />
              <span>Test Contact Map</span>
            </a>
          </div>
        </div>
      </div>

      {/* Video Test Component */}
      {showVideoTest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <VideoTest />
        </motion.div>
      )}
    </div>
  )
}

export default FixVerification
