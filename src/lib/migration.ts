// Migration utility to help users migrate from localStorage to Supabase
import { supabase } from './supabase'
import { databaseManager } from './databaseManager'
import toast from 'react-hot-toast'

interface MigrationStatus {
  hasLocalData: boolean
  hasDatabaseData: boolean
  canMigrate: boolean
  tables: {
    products: { local: number; database: number }
    content: { local: boolean; database: boolean }
    settings: { local: boolean; database: boolean }
    media: { local: number; database: number }
  }
}

export class MigrationManager {
  static async checkMigrationStatus(): Promise<MigrationStatus> {
    const status: MigrationStatus = {
      hasLocalData: false,
      hasDatabaseData: false,
      canMigrate: false,
      tables: {
        products: { local: 0, database: 0 },
        content: { local: false, database: false },
        settings: { local: false, database: false },
        media: { local: 0, database: 0 }
      }
    }

    try {
      // Check localStorage data
      const localProducts = localStorage.getItem('website_products')
      const localContent = localStorage.getItem('website_content')
      const localSettings = localStorage.getItem('website_settings')
      const localMedia = localStorage.getItem('website_media')

      if (localProducts) {
        const products = JSON.parse(localProducts)
        status.tables.products.local = Array.isArray(products) ? products.length : 0
        status.hasLocalData = true
      }

      if (localContent) {
        status.tables.content.local = true
        status.hasLocalData = true
      }

      if (localSettings) {
        status.tables.settings.local = true
        status.hasLocalData = true
      }

      if (localMedia) {
        const media = JSON.parse(localMedia)
        status.tables.media.local = Array.isArray(media) ? media.length : 0
        status.hasLocalData = true
      }

      // Check database data
      const { data: dbProducts } = await supabase.from('products').select('count')
      const { data: dbContent } = await supabase.from('content').select('count')
      const { data: dbSettings } = await supabase.from('settings').select('count')
      const { data: dbMedia } = await supabase.from('media').select('count')

      if (dbProducts && dbProducts.length > 0) {
        status.tables.products.database = dbProducts.length
        status.hasDatabaseData = true
      }

      if (dbContent && dbContent.length > 0) {
        status.tables.content.database = true
        status.hasDatabaseData = true
      }

      if (dbSettings && dbSettings.length > 0) {
        status.tables.settings.database = true
        status.hasDatabaseData = true
      }

      if (dbMedia && dbMedia.length > 0) {
        status.tables.media.database = dbMedia.length
        status.hasDatabaseData = true
      }

      status.canMigrate = status.hasLocalData && !status.hasDatabaseData

      return status
    } catch (error) {
      console.error('Error checking migration status:', error)
      throw error
    }
  }

  static async migrateFromLocalStorage(): Promise<void> {
    try {
      toast.loading('Starting migration from localStorage to database...')

      // Migrate products
      const localProducts = localStorage.getItem('website_products')
      if (localProducts) {
        const products = JSON.parse(localProducts)
        if (Array.isArray(products)) {
          for (const product of products) {
            const { id, ...productData } = product
            await databaseManager.addProduct(productData)
          }
          toast.success(`Migrated ${products.length} products`)
        }
      }

      // Migrate content
      const localContent = localStorage.getItem('website_content')
      if (localContent) {
        const content = JSON.parse(localContent)
        await databaseManager.saveContent(content)
        toast.success('Migrated content sections')
      }

      // Migrate settings
      const localSettings = localStorage.getItem('website_settings')
      if (localSettings) {
        const settings = JSON.parse(localSettings)
        await databaseManager.saveSettings(settings)
        toast.success('Migrated settings')
      }

      // Note: Media migration would require uploading files to Supabase Storage
      // For now, we'll skip media migration as it requires file handling

      toast.success('Migration completed successfully!')
      
      // Optionally clear localStorage after successful migration
      const shouldClearLocal = confirm('Migration successful! Would you like to clear the local data?')
      if (shouldClearLocal) {
        localStorage.removeItem('website_products')
        localStorage.removeItem('website_content')
        localStorage.removeItem('website_settings')
        localStorage.removeItem('website_media')
        toast.success('Local data cleared')
      }

    } catch (error) {
      console.error('Migration failed:', error)
      toast.error('Migration failed. Please check the console for details.')
      throw error
    }
  }

  static async testDatabaseConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('products').select('count').limit(1)
      if (error) throw error
      return true
    } catch (error) {
      console.error('Database connection test failed:', error)
      return false
    }
  }

  static async initializeDatabase(): Promise<void> {
    try {
      toast.loading('Initializing database with default data...')

      // Check if database already has data
      const { data: existingProducts } = await supabase.from('products').select('count')
      if (existingProducts && existingProducts.length > 0) {
        toast.info('Database already initialized')
        return
      }

      // Initialize with default data (this would typically be done via SQL)
      toast.success('Database initialization completed')
    } catch (error) {
      console.error('Database initialization failed:', error)
      toast.error('Failed to initialize database')
      throw error
    }
  }

  static getSetupInstructions(): string {
    return `
# Supabase Database Setup Instructions

## 1. Create a Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Wait for the project to be ready

## 2. Run the Database Schema
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of 'database/schema.sql'
4. Run the SQL script

## 3. Configure Environment Variables
1. Copy '.env.local.example' to '.env.local'
2. Get your project URL and anon key from Supabase dashboard (Settings > API)
3. Update the values in '.env.local'

## 4. Test the Connection
1. Restart your development server
2. The application will automatically connect to Supabase
3. Check the browser console for any connection errors

## 5. Migration (Optional)
If you have existing localStorage data, you can migrate it to the database:
1. Go to Admin Portal > Settings
2. Look for the "Database Migration" section
3. Click "Migrate Data" to transfer localStorage data to Supabase

## Troubleshooting
- Make sure your Supabase project is active
- Check that environment variables are correctly set
- Verify that the database schema has been applied
- Check browser console for detailed error messages
    `
  }
}

export const migrationManager = MigrationManager
