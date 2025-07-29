"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bug, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  Upload,
  Eye,
  RefreshCw
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { testStorageConnection, getStorageConfigStatus } from '../../lib/imageUpload'
import toast from 'react-hot-toast'

interface DebugResult {
  step: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: any
}

const StorageDebugger: React.FC = () => {
  const [isDebugging, setIsDebugging] = useState(false)
  const [results, setResults] = useState<DebugResult[]>([])

  const addResult = (result: DebugResult) => {
    setResults(prev => [...prev, result])
  }

  const runDiagnostics = async () => {
    setIsDebugging(true)
    setResults([])

    try {
      // Step 1: Check S3 environment variables
      const s3Config = getStorageConfigStatus()
      addResult({
        step: 'S3 Environment Variables',
        status: s3Config.hasEndpoint && s3Config.hasAccessKey && s3Config.hasSecretKey ? 'success' : 'error',
        message: s3Config.hasEndpoint && s3Config.hasAccessKey && s3Config.hasSecretKey
          ? 'S3 configuration complete'
          : 'Missing S3 environment variables',
        details: {
          hasEndpoint: s3Config.hasEndpoint,
          hasAccessKey: s3Config.hasAccessKey,
          hasSecretKey: s3Config.hasSecretKey,
          hasBucketName: s3Config.hasBucketName,
          endpoint: s3Config.endpoint ? `${s3Config.endpoint.substring(0, 50)}...` : 'MISSING',
          bucketName: s3Config.bucketName
        }
      })

      // Step 1.5: Check Supabase environment variables (still needed for database)
      addResult({
        step: 'Supabase Environment Variables',
        status: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'success' : 'error',
        message: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? 'Supabase environment variables are set'
          : 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY',
        details: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL ?
            `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...` : 'MISSING'
        }
      })

      // Step 2: Test Supabase connection
      try {
        const { data, error } = await supabase.from('products').select('count').limit(1)
        addResult({
          step: 'Database Connection',
          status: error ? 'error' : 'success',
          message: error ? `Database connection failed: ${error.message}` : 'Database connection successful',
          details: { data, error }
        })
      } catch (error: any) {
        addResult({
          step: 'Database Connection',
          status: 'error',
          message: `Database connection failed: ${error.message}`,
          details: error
        })
      }

      // Step 3: List storage buckets
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets()
        const websiteImagesBucket = buckets?.find(b => b.name === 'website-images')
        
        addResult({
          step: 'Storage Buckets',
          status: error ? 'error' : websiteImagesBucket ? 'success' : 'warning',
          message: error ? `Failed to list buckets: ${error.message}` :
                   websiteImagesBucket ? 'website-images bucket found' : 'website-images bucket not found',
          details: { buckets, websiteImagesBucket }
        })

        // Step 4: Check bucket configuration
        if (websiteImagesBucket) {
          addResult({
            step: 'Bucket Configuration',
            status: websiteImagesBucket.public ? 'success' : 'error',
            message: websiteImagesBucket.public ? 'Bucket is public' : 'Bucket is not public',
            details: {
              name: websiteImagesBucket.name,
              public: websiteImagesBucket.public,
              fileSizeLimit: websiteImagesBucket.file_size_limit,
              allowedMimeTypes: websiteImagesBucket.allowed_mime_types
            }
          })
        }
      } catch (error: any) {
        addResult({
          step: 'Storage Buckets',
          status: 'error',
          message: `Storage access failed: ${error.message}`,
          details: error
        })
      }

      // Step 5: Test S3 connection
      try {
        const connectionOk = await testStorageConnection()
        addResult({
          step: 'S3 Connection Test',
          status: connectionOk ? 'success' : 'error',
          message: connectionOk ? 'S3 connection successful' : 'S3 connection failed',
          details: { connectionOk }
        })
      } catch (error: any) {
        addResult({
          step: 'S3 Connection Test',
          status: 'error',
          message: `S3 connection test failed: ${error.message}`,
          details: error
        })
      }

      // Step 6: Check local storage override
      const forceLocal = localStorage.getItem('force_local_storage')
      addResult({
        step: 'Local Storage Override',
        status: forceLocal === 'true' ? 'warning' : 'success',
        message: forceLocal === 'true' ? 'Local storage is forced (override active)' : 'No local storage override',
        details: { forceLocal }
      })

    } catch (error: any) {
      addResult({
        step: 'General Error',
        status: 'error',
        message: `Diagnostics failed: ${error.message}`,
        details: error
      })
    } finally {
      setIsDebugging(false)
    }
  }

  const clearLocalOverride = () => {
    localStorage.removeItem('force_local_storage')
    toast.success('Local storage override cleared')
    runDiagnostics()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={20} className="text-green-500" />
      case 'error': return <XCircle size={20} className="text-red-500" />
      case 'warning': return <AlertTriangle size={20} className="text-yellow-500" />
      default: return <Database size={20} className="text-gray-500" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bug size={24} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Storage Diagnostics</h3>
            <p className="text-sm text-gray-600">Debug Supabase Storage configuration</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={clearLocalOverride}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Clear Override
          </button>
          <button
            onClick={runDiagnostics}
            disabled={isDebugging}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isDebugging ? 'animate-spin' : ''} />
            <span>{isDebugging ? 'Running...' : 'Run Diagnostics'}</span>
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, index) => (
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
                    <h4 className="font-medium text-gray-900">{result.step}</h4>
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

      {results.length === 0 && !isDebugging && (
        <div className="text-center py-8 text-gray-500">
          <Bug size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Click "Run Diagnostics" to check your Supabase Storage configuration</p>
        </div>
      )}
    </div>
  )
}

export default StorageDebugger
