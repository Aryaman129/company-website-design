"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'

const GlobalPersistenceVerifier: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResults, setVerificationResults] = useState<any[]>([])

  const verifyGlobalPersistence = async () => {
    setIsVerifying(true)
    setVerificationResults([])
    
    const results: any[] = []

    try {
      // Test 1: Check if local storage override is cleared
      const forceLocal = localStorage.getItem('force_local_storage')
      results.push({
        test: 'Local Storage Override',
        status: forceLocal !== 'true' ? 'success' : 'error',
        message: forceLocal !== 'true' ? 'No local storage override - global mode active' : 'Local storage override detected',
        details: { forceLocal }
      })

      // Test 2: Check S3 configuration
      const hasS3Config = !!(
        process.env.NEXT_PUBLIC_S3_ENDPOINT &&
        process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID &&
        process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
      )
      
      results.push({
        test: 'S3 Configuration',
        status: hasS3Config ? 'success' : 'error',
        message: hasS3Config ? 'S3 credentials configured for global storage' : 'Missing S3 configuration',
        details: {
          hasEndpoint: !!process.env.NEXT_PUBLIC_S3_ENDPOINT,
          hasAccessKey: !!process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
          hasSecretKey: !!process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
        }
      })

      // Test 3: Check if URLs are global (not blob: URLs)
      const testImageUrls = [
        // Check recent uploads from different sources
        document.querySelector('img[src*="supabase"]')?.getAttribute('src'),
        document.querySelector('img[src*="storage"]')?.getAttribute('src'),
      ].filter(Boolean)

      const globalUrls = testImageUrls.filter(url => 
        url && !url.startsWith('blob:') && !url.startsWith('data:')
      )

      results.push({
        test: 'Image URL Format',
        status: testImageUrls.length === 0 ? 'warning' : globalUrls.length === testImageUrls.length ? 'success' : 'error',
        message: testImageUrls.length === 0 ? 'No images found to test' : 
                globalUrls.length === testImageUrls.length ? 'All images use global URLs' : 'Some images use local URLs',
        details: {
          totalImages: testImageUrls.length,
          globalImages: globalUrls.length,
          sampleUrls: testImageUrls.slice(0, 3)
        }
      })

      // Test 4: Verify public accessibility
      if (globalUrls.length > 0) {
        try {
          const testUrl = globalUrls[0]
          const response = await fetch(testUrl, { method: 'HEAD' })
          
          results.push({
            test: 'Public Accessibility',
            status: response.ok ? 'success' : 'error',
            message: response.ok ? 'Images are publicly accessible' : `HTTP ${response.status}: Images not publicly accessible`,
            details: {
              testUrl,
              status: response.status,
              statusText: response.statusText
            }
          })
        } catch (error: any) {
          results.push({
            test: 'Public Accessibility',
            status: 'error',
            message: `Network error: ${error.message}`,
            details: { error: error.message }
          })
        }
      }

      // Test 5: Check database persistence
      try {
        const response = await fetch('/api/test-persistence', { method: 'GET' })
        results.push({
          test: 'Database Persistence',
          status: response.ok ? 'success' : 'warning',
          message: response.ok ? 'Database connection active for persistence' : 'Database connection issue',
          details: { status: response.status }
        })
      } catch (error) {
        results.push({
          test: 'Database Persistence',
          status: 'warning',
          message: 'Could not test database connection',
          details: { error: 'API endpoint not available' }
        })
      }

    } catch (error: any) {
      results.push({
        test: 'General Error',
        status: 'error',
        message: `Verification failed: ${error.message}`,
        details: error
      })
    }

    setVerificationResults(results)
    setIsVerifying(false)

    // Show summary toast
    const successCount = results.filter(r => r.status === 'success').length
    const totalCount = results.length
    
    if (successCount === totalCount) {
      toast.success('✅ Global persistence verified! All images are stored permanently.')
    } else if (successCount > totalCount / 2) {
      toast.success(`⚠️ Mostly working: ${successCount}/${totalCount} tests passed`)
    } else {
      toast.error(`❌ Issues detected: Only ${successCount}/${totalCount} tests passed`)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={20} className="text-green-500" />
      case 'error': return <XCircle size={20} className="text-red-500" />
      case 'warning': return <AlertTriangle size={20} className="text-yellow-500" />
      default: return <Globe size={20} className="text-gray-500" />
    }
  }

  const openInNewTab = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Globe size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Global Persistence Verification</h3>
            <p className="text-sm text-gray-600">Verify images are stored permanently and accessible worldwide</p>
          </div>
        </div>
        
        <button
          onClick={verifyGlobalPersistence}
          disabled={isVerifying}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={isVerifying ? 'animate-spin' : ''} />
          <span>{isVerifying ? 'Verifying...' : 'Verify Global Persistence'}</span>
        </button>
      </div>

      {verificationResults.length > 0 && (
        <div className="space-y-3">
          {verificationResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                result.status === 'success' ? 'bg-green-50 border-green-400' :
                result.status === 'error' ? 'bg-red-50 border-red-400' :
                'bg-yellow-50 border-yellow-400'
              }`}
            >
              <div className="flex items-start space-x-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{result.test}</h4>
                    {result.details?.testUrl && (
                      <button
                        onClick={() => openInNewTab(result.details.testUrl)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Eye size={14} />
                        <span>Test URL</span>
                        <ExternalLink size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        View Details
                      </summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {verificationResults.length === 0 && !isVerifying && (
        <div className="text-center py-8 text-gray-500">
          <Globe size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Click "Verify Global Persistence" to check if your images are stored permanently</p>
          <p className="text-sm mt-2">This ensures all users worldwide can see your uploaded images</p>
        </div>
      )}

      {/* Global Persistence Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">🌍 Global Persistence Means:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Images are stored permanently in Supabase Storage</li>
          <li>• All users worldwide can see the same images</li>
          <li>• Images survive browser refreshes and device changes</li>
          <li>• No local storage fallbacks that only work on your device</li>
          <li>• Real-time updates across all users and devices</li>
        </ul>
      </div>
    </div>
  )
}

export default GlobalPersistenceVerifier
