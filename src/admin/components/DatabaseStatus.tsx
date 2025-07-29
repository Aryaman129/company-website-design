"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  HardDrive,
  Upload,
  Download,
  Settings
} from 'lucide-react'
import { useWebsiteData } from '../../hooks/useWebsiteData'
import { migrationManager } from '../../lib/migration'
import DatabaseSetupGuide from './DatabaseSetupGuide'
import StorageSetupHelper from './StorageSetupHelper'
import StorageDebugger from './StorageDebugger'
import GlobalPersistenceVerifier from './GlobalPersistenceVerifier'
import FixVerification from './FixVerification'
import toast from 'react-hot-toast'

const DatabaseStatus: React.FC = () => {
  const { getConnectionStatus, reconnectToDatabase } = useWebsiteData()
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [migrationStatus, setMigrationStatus] = useState<any>(null)
  const [showMigration, setShowMigration] = useState(false)
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [showStorageHelper, setShowStorageHelper] = useState(false)

  const loadStatus = async () => {
    try {
      setLoading(true)
      const status = await getConnectionStatus()
      setConnectionStatus(status)

      // Check migration status
      try {
        const migration = await migrationManager.checkMigrationStatus()
        setMigrationStatus(migration)
        setShowMigration(migration.hasLocalData && !migration.hasDatabaseData)
      } catch (error) {
        console.error('Failed to check migration status:', error)
      }
    } catch (error) {
      console.error('Failed to load connection status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  const handleReconnect = async () => {
    setLoading(true)
    try {
      const success = await reconnectToDatabase()
      if (success) {
        await loadStatus()
      }
    } catch (error) {
      console.error('Reconnection failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMigration = async () => {
    try {
      setLoading(true)
      await migrationManager.migrateFromLocalStorage()
      await loadStatus()
      toast.success('Migration completed successfully!')
    } catch (error) {
      console.error('Migration failed:', error)
      toast.error('Migration failed. Please check the console for details.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !connectionStatus) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Checking database connection...</span>
        </div>
      </div>
    )
  }

  const isConnected = connectionStatus?.connected
  const mode = connectionStatus?.mode || 'localStorage'

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-yellow-100'}`}>
              {isConnected ? (
                <Database size={20} className="text-green-600" />
              ) : (
                <HardDrive size={20} className="text-yellow-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Data Storage Status</h3>
              <p className="text-sm text-gray-500">
                Current mode: <span className="font-medium capitalize">{mode}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Wifi size={16} />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-600">
                <WifiOff size={16} />
                <span className="text-sm font-medium">Local Storage</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle size={16} className={isConnected ? 'text-green-500' : 'text-gray-400'} />
              <span className="text-sm font-medium">Database</span>
            </div>
            <p className="text-xs text-gray-600">
              {isConnected ? 'Connected to Supabase' : 'Not connected'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle size={16} className={connectionStatus?.hasEnvironmentVars ? 'text-green-500' : 'text-red-500'} />
              <span className="text-sm font-medium">Configuration</span>
            </div>
            <p className="text-xs text-gray-600">
              {connectionStatus?.hasEnvironmentVars ? 'Environment variables set' : 'Missing environment variables'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm font-medium">Fallback</span>
            </div>
            <p className="text-xs text-gray-600">
              localStorage available
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReconnect}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Reconnect</span>
          </button>

          <button
            onClick={() => setShowStorageHelper(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Upload size={16} />
            <span>Image Storage</span>
          </button>

          <button
            onClick={loadStatus}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Status</span>
          </button>
        </div>
      </motion.div>

      {/* Migration Panel */}
      {showMigration && migrationStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                Local Data Migration Available
              </h4>
              <p className="text-yellow-700 mb-4">
                We found local data that can be migrated to the database. This will make your content 
                available to all users globally instead of just on this device.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                  <div className="text-sm font-medium text-gray-900">Products</div>
                  <div className="text-lg font-bold text-yellow-600">
                    {migrationStatus.tables.products.local}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                  <div className="text-sm font-medium text-gray-900">Content</div>
                  <div className="text-lg font-bold text-yellow-600">
                    {migrationStatus.tables.content.local ? '✓' : '✗'}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                  <div className="text-sm font-medium text-gray-900">Settings</div>
                  <div className="text-lg font-bold text-yellow-600">
                    {migrationStatus.tables.settings.local ? '✓' : '✗'}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-yellow-200">
                  <div className="text-sm font-medium text-gray-900">Media</div>
                  <div className="text-lg font-bold text-yellow-600">
                    {migrationStatus.tables.media.local}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleMigration}
                  disabled={loading || !isConnected}
                  className="flex items-center space-x-2 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  <Upload size={16} />
                  <span>Migrate to Database</span>
                </button>

                <button
                  onClick={() => setShowMigration(false)}
                  className="px-4 py-2 text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Setup Instructions */}
      {!isConnected && !connectionStatus?.hasEnvironmentVars && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <div className="flex items-start space-x-3">
            <Settings size={20} className="text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">
                Database Setup Required
              </h4>
              <p className="text-blue-700 mb-4">
                To enable global data synchronization, you need to set up a Supabase database.
              </p>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {migrationManager.getSetupInstructions()}
                </pre>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSetupGuide(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Settings size={16} />
                  <span>Setup Guide</span>
                </button>

                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Database size={16} />
                  <span>Create Project</span>
                </a>

                <button
                  onClick={loadStatus}
                  className="px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Check Again
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Setup Guide Modal */}
      <DatabaseSetupGuide
        isOpen={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
      />

      {/* Storage Setup Helper Modal */}
      <StorageSetupHelper
        isOpen={showStorageHelper}
        onClose={() => setShowStorageHelper(false)}
      />

      {/* Storage Debugger */}
      <StorageDebugger />

      {/* Global Persistence Verifier */}
      <GlobalPersistenceVerifier />

      {/* Fix Verification */}
      <FixVerification />
    </div>
  )
}

export default DatabaseStatus
