// Hybrid Data Manager - Automatically switches between database and localStorage
import { databaseManager } from './databaseManager'
import { dataManager as localDataManager } from './dataManager'
import { testSupabaseConnection } from './supabase'
import { eventBus, EVENTS } from './eventBus'
import toast from 'react-hot-toast'

// Re-export types for compatibility
export * from './databaseManager'

class HybridDataManager {
  private static instance: HybridDataManager
  private useDatabaseMode = false
  private connectionTested = false
  private fallbackWarningShown = false

  static getInstance(): HybridDataManager {
    if (!HybridDataManager.instance) {
      HybridDataManager.instance = new HybridDataManager()
    }
    return HybridDataManager.instance
  }

  private async checkDatabaseAvailability(): Promise<boolean> {
    if (this.connectionTested) {
      return this.useDatabaseMode
    }

    try {
      // Check if environment variables are set
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('Supabase environment variables not found, using localStorage')
        this.useDatabaseMode = false
        this.connectionTested = true
        return false
      }

      // Test database connection
      const isConnected = await testSupabaseConnection()
      this.useDatabaseMode = isConnected
      this.connectionTested = true

      if (isConnected) {
        console.log('Database connection successful, using Supabase')
      } else {
        console.log('Database connection failed, falling back to localStorage')
        this.fallbackWarningShown = true
      }

      return this.useDatabaseMode
    } catch (error) {
      console.error('Database availability check failed:', error)
      this.useDatabaseMode = false
      this.connectionTested = true
      
      this.fallbackWarningShown = true
      
      return false
    }
  }

  private async getManager() {
    const useDatabase = await this.checkDatabaseAvailability()
    return useDatabase ? databaseManager : localDataManager
  }

  // Products Management
  async getProducts() {
    const manager = await this.getManager()
    return manager.getProducts()
  }

  async addProduct(product: any) {
    const manager = await this.getManager()
    return manager.addProduct(product)
  }

  async updateProduct(id: number, updates: any) {
    const manager = await this.getManager()
    return manager.updateProduct(id, updates)
  }

  async deleteProduct(id: number) {
    const manager = await this.getManager()
    return manager.deleteProduct(id)
  }

  // Content Management
  async getContent() {
    const manager = await this.getManager()
    return manager.getContent()
  }

  async saveContent(content: any) {
    const manager = await this.getManager()
    return manager.saveContent(content)
  }

  // Settings Management
  async getSettings() {
    const manager = await this.getManager()
    return manager.getSettings()
  }

  async saveSettings(settings: any) {
    const manager = await this.getManager()
    return manager.saveSettings(settings)
  }

  // Media Management
  async getMedia() {
    const manager = await this.getManager()
    return manager.getMedia()
  }

  async addMediaItem(file: File, category?: string) {
    const manager = await this.getManager()
    return manager.addMediaItem(file, category)
  }

  async deleteMediaItem(id: string) {
    const manager = await this.getManager()
    return manager.deleteMediaItem(id)
  }

  // Testimonials Management
  async addTestimonial(testimonial: any) {
    const manager = await this.getManager()
    return manager.addTestimonial(testimonial)
  }

  async updateTestimonial(id: number, updates: any) {
    const manager = await this.getManager()
    return manager.updateTestimonial(id, updates)
  }

  async deleteTestimonial(id: number) {
    const manager = await this.getManager()
    return manager.deleteTestimonial(id)
  }

  // Utility Methods
  async exportData() {
    const manager = await this.getManager()
    return manager.exportData()
  }

  async importData(jsonData: string) {
    const manager = await this.getManager()
    return manager.importData(jsonData)
  }

  // Status Methods
  async getConnectionStatus() {
    const useDatabase = await this.checkDatabaseAvailability()
    return {
      mode: useDatabase ? 'database' : 'localStorage',
      connected: useDatabase,
      hasEnvironmentVars: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    }
  }

  // Force reconnection attempt
  async reconnectToDatabase() {
    this.connectionTested = false
    this.fallbackWarningShown = false
    const connected = await this.checkDatabaseAvailability()
    
    if (connected) {
      // Emit event to refresh all data
      eventBus.emit(EVENTS.DATA_UPDATED, { type: 'reconnection', data: null })
    }
    
    return connected
  }

  // Switch to localStorage mode (for testing or fallback)
  forceLocalStorageMode() {
    this.useDatabaseMode = false
    this.connectionTested = true
    eventBus.emit(EVENTS.DATA_UPDATED, { type: 'mode_switch', data: 'localStorage' })
  }

  // Switch to database mode (if available)
  async forceDatabaseMode() {
    const connected = await testSupabaseConnection()
    if (connected) {
      this.useDatabaseMode = true
      this.connectionTested = true
      eventBus.emit(EVENTS.DATA_UPDATED, { type: 'mode_switch', data: 'database' })
      return true
    } else {
      return false
    }
  }
}

export const hybridDataManager = HybridDataManager.getInstance()

// For backward compatibility, export as dataManager
export const dataManager = hybridDataManager
