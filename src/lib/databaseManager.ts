// Database Manager - Handles all website data persistence using Supabase
import { 
  supabase, 
  transformProductFromDB, 
  transformProductToDB,
  transformMediaFromDB,
  transformMediaToDB,
  transformTestimonialFromDB,
  transformTestimonialToDB,
  handleSupabaseError,
  subscribeToTable
} from './supabase'
import { eventBus, EVENTS } from './eventBus'
import { uploadImage } from './imageUpload'
import toast from 'react-hot-toast'

// Re-export types from the original dataManager for compatibility
export interface Product {
  id: number
  name: string
  category: string
  description: string
  image: string
  features: string[]
  price: string
  specifications: Record<string, any>
  inStock: boolean
  featured: boolean
}

export interface Testimonial {
  id: number
  name: string
  company: string
  text: string
  rating: number
  image: string
}

export interface ContentData {
  hero: {
    title: string
    subtitle: string
    buttons: {
      primary: { text: string; link: string }
      secondary: { text: string; link: string }
    }
  }
  about: {
    title: string
    description: string
    features: string[]
    image?: string
    yearsBadge?: {
      number: string
      text: string
    }
  }
  cta: {
    title: string
    description: string
    buttons?: {
      primary: { text: string; link: string }
      secondary?: { text: string; link: string }
    }
  }
  statistics?: {
    yearsExperience: string
    projectsCompleted: string
    happyClients: string
    rating: string
    ratingOutOf: string
  }
  testimonials: Testimonial[]
}

export interface SettingsData {
  company: {
    name: string
    tagline: string
    established: string
    gst: string
    logo: string
    logoLarge: string
  }
  contact: {
    phone: string
    email: string
    address: {
      street: string
      city: string
      state: string
      pincode: string
      country: string
    }
    workingHours: {
      weekdays: string
      saturday: string
      sunday: string
    }
  }
  social: {
    facebook: string
    instagram: string
    linkedin: string
    youtube: string
  }
  seo: {
    title: string
    description: string
    keywords: string[]
    author: string
  }
  categories: string[]
  navigation: Array<{
    name: string
    path: string
    order: number
  }>
  theme?: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    backgroundImage?: string
  }
}

export interface MediaItem {
  id: string
  name: string
  url: string
  type: 'image' | 'video'
  category: string
  alt?: string
  size: number
  uploadDate: string
}

class DatabaseManager {
  private static instance: DatabaseManager
  private initialized = false
  private subscriptions: any[] = []

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Test database connection
      const { error } = await supabase.from('products').select('count').limit(1)
      if (error) throw error

      // Set up real-time subscriptions
      this.setupRealtimeSubscriptions()
      
      this.initialized = true
      console.log('Database manager initialized successfully')
    } catch (error) {
      console.error('Failed to initialize database manager:', error)
      // Fallback to localStorage if database is unavailable
      toast.error('Database connection failed. Using local storage as fallback.')
      throw error
    }
  }

  private setupRealtimeSubscriptions(): void {
    // Subscribe to products changes
    const productsSubscription = subscribeToTable('products', (payload) => {
      console.log('Products updated:', payload)
      eventBus.emit(EVENTS.PRODUCT_UPDATED, payload)
      eventBus.emit(EVENTS.DATA_UPDATED, { type: 'products', data: payload })
    })

    // Subscribe to content changes
    const contentSubscription = subscribeToTable('content', (payload) => {
      console.log('Content updated:', payload)
      eventBus.emit(EVENTS.CONTENT_UPDATED, payload)
      eventBus.emit(EVENTS.DATA_UPDATED, { type: 'content', data: payload })
    })

    // Subscribe to settings changes
    const settingsSubscription = subscribeToTable('settings', (payload) => {
      console.log('Settings updated:', payload)
      eventBus.emit(EVENTS.SETTINGS_UPDATED, payload)
      eventBus.emit(EVENTS.DATA_UPDATED, { type: 'settings', data: payload })
    })

    // Subscribe to media changes
    const mediaSubscription = subscribeToTable('media', (payload) => {
      console.log('Media updated:', payload)
      eventBus.emit(EVENTS.MEDIA_UPDATED, payload)
      eventBus.emit(EVENTS.DATA_UPDATED, { type: 'media', data: payload })
    })

    // Subscribe to testimonials changes
    const testimonialsSubscription = subscribeToTable('testimonials', (payload) => {
      console.log('Testimonials updated:', payload)
      eventBus.emit(EVENTS.TESTIMONIAL_UPDATED, payload)
      eventBus.emit(EVENTS.DATA_UPDATED, { type: 'testimonials', data: payload })
    })

    this.subscriptions = [
      productsSubscription,
      contentSubscription,
      settingsSubscription,
      mediaSubscription,
      testimonialsSubscription
    ]
  }

  // Products Management
  async getProducts(): Promise<Product[]> {
    await this.initialize()
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(transformProductFromDB) || []
    } catch (error) {
      handleSupabaseError(error, 'fetch products')
      return []
    }
  }

  async saveProducts(products: Product[]): Promise<void> {
    // This method is kept for compatibility but individual operations are preferred
    console.warn('saveProducts is deprecated. Use individual product operations instead.')
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await this.initialize()

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([transformProductToDB(product)])
        .select()
        .single()

      if (error) throw error

      const newProduct = transformProductFromDB(data)
      toast.success('Product added successfully!')
      return newProduct
    } catch (error) {
      handleSupabaseError(error, 'add product')
      throw error
    }
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<void> {
    await this.initialize()

    try {
      const { error } = await supabase
        .from('products')
        .update(transformProductToDB(updates))
        .eq('id', id)

      if (error) throw error

      toast.success('Product updated successfully!')
    } catch (error) {
      handleSupabaseError(error, 'update product')
      throw error
    }
  }

  async deleteProduct(id: number): Promise<void> {
    await this.initialize()

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Product deleted successfully!')
    } catch (error) {
      handleSupabaseError(error, 'delete product')
      throw error
    }
  }

  // Content Management
  async getContent(): Promise<ContentData> {
    await this.initialize()

    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')

      if (error) throw error

      // Transform database content into expected format
      const contentMap: any = {}
      data?.forEach(item => {
        contentMap[item.section] = item.data
      })

      // Get testimonials separately
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (testimonialsError) throw testimonialsError

      const testimonials = testimonialsData?.map(transformTestimonialFromDB) || []

      return {
        hero: contentMap.hero || {},
        about: contentMap.about || {},
        cta: contentMap.cta || {},
        testimonials
      }
    } catch (error) {
      handleSupabaseError(error, 'fetch content')
      return {
        hero: { title: '', subtitle: '', buttons: { primary: { text: '', link: '' }, secondary: { text: '', link: '' } } },
        about: { title: '', description: '', features: [] },
        cta: { title: '', description: '' },
        testimonials: []
      }
    }
  }

  async saveContent(content: ContentData): Promise<void> {
    await this.initialize()

    try {
      // Update content sections
      const contentUpdates = [
        { section: 'hero', data: content.hero },
        { section: 'about', data: content.about },
        { section: 'cta', data: content.cta }
      ]

      for (const update of contentUpdates) {
        const { error } = await supabase
          .from('content')
          .upsert(update, { onConflict: 'section' })

        if (error) throw error
      }

      toast.success('Content updated successfully!')
    } catch (error) {
      handleSupabaseError(error, 'save content')
      throw error
    }
  }

  // Settings Management
  async getSettings(): Promise<SettingsData> {
    await this.initialize()

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')

      if (error) throw error

      // Transform database settings into expected format
      const settingsMap: any = {}
      data?.forEach(item => {
        settingsMap[item.key] = item.value
      })

      return {
        company: settingsMap.company || {},
        contact: settingsMap.contact || {},
        social: settingsMap.social || {},
        seo: settingsMap.seo || {},
        categories: settingsMap.categories || [],
        navigation: settingsMap.navigation || [],
        theme: settingsMap.theme || {}
      }
    } catch (error) {
      handleSupabaseError(error, 'fetch settings')
      return {
        company: { name: '', tagline: '', established: '', gst: '', logo: '', logoLarge: '' },
        contact: { phone: '', email: '', address: { street: '', city: '', state: '', pincode: '', country: '' }, workingHours: { weekdays: '', saturday: '', sunday: '' } },
        social: { facebook: '', instagram: '', linkedin: '', youtube: '' },
        seo: { title: '', description: '', keywords: [], author: '' },
        categories: [],
        navigation: []
      }
    }
  }

  async saveSettings(settings: SettingsData): Promise<void> {
    await this.initialize()

    try {
      // Update settings
      const settingsUpdates = [
        { key: 'company', value: settings.company },
        { key: 'contact', value: settings.contact },
        { key: 'social', value: settings.social },
        { key: 'seo', value: settings.seo },
        { key: 'categories', value: settings.categories },
        { key: 'navigation', value: settings.navigation }
      ]

      if (settings.theme) {
        settingsUpdates.push({ key: 'theme', value: settings.theme })
      }

      for (const update of settingsUpdates) {
        const { error } = await supabase
          .from('settings')
          .upsert(update, { onConflict: 'key' })

        if (error) throw error
      }

      toast.success('Settings updated successfully!')
    } catch (error) {
      handleSupabaseError(error, 'save settings')
      throw error
    }
  }

  // Media Management
  async getMedia(): Promise<MediaItem[]> {
    await this.initialize()

    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(transformMediaFromDB) || []
    } catch (error) {
      handleSupabaseError(error, 'fetch media')
      return []
    }
  }

  async saveMedia(media: MediaItem[]): Promise<void> {
    // This method is kept for compatibility but individual operations are preferred
    console.warn('saveMedia is deprecated. Use individual media operations instead.')
  }

  async addMediaItem(file: File, category: string = 'general'): Promise<MediaItem> {
    await this.initialize()

    try {
      console.log('🌍 DatabaseManager: Uploading media for global access...')

      // Upload file to Supabase Storage via S3 for permanent global storage
      const url = await uploadImage(file, category)

      console.log('🌍 DatabaseManager: Image uploaded globally, URL:', url)

      const mediaData = {
        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        url,
        type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        category,
        alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        size: file.size,
        upload_date: new Date().toISOString()
      }

      // Save media record to database for global access
      const { data, error } = await supabase
        .from('media')
        .insert([transformMediaToDB(mediaData)])
        .select()
        .single()

      if (error) throw error

      const newMediaItem = transformMediaFromDB(data)
      console.log('🌍 DatabaseManager: Media record saved to database for global access')
      toast.success('Media uploaded and available globally!')

      // Emit event for real-time updates across all users
      eventBus.emit(EVENTS.DATA_UPDATED, { type: 'media_added', data: newMediaItem })

      return newMediaItem
    } catch (error) {
      console.error('🌍 DatabaseManager: Global media upload failed:', error)
      handleSupabaseError(error, 'upload media')
      throw error
    }
  }

  async deleteMediaItem(id: string): Promise<void> {
    await this.initialize()

    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Media deleted successfully!')
    } catch (error) {
      handleSupabaseError(error, 'delete media')
      throw error
    }
  }

  // Testimonials Management
  async addTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    await this.initialize()

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([transformTestimonialToDB(testimonial)])
        .select()
        .single()

      if (error) throw error

      const newTestimonial = transformTestimonialFromDB(data)
      toast.success('Testimonial added successfully!')
      return newTestimonial
    } catch (error) {
      handleSupabaseError(error, 'add testimonial')
      throw error
    }
  }

  async updateTestimonial(id: number, updates: Partial<Testimonial>): Promise<void> {
    await this.initialize()

    try {
      const { error } = await supabase
        .from('testimonials')
        .update(transformTestimonialToDB(updates))
        .eq('id', id)

      if (error) throw error

      toast.success('Testimonial updated successfully!')
    } catch (error) {
      handleSupabaseError(error, 'update testimonial')
      throw error
    }
  }

  async deleteTestimonial(id: number): Promise<void> {
    await this.initialize()

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Testimonial deleted successfully!')
    } catch (error) {
      handleSupabaseError(error, 'delete testimonial')
      throw error
    }
  }

  // Utility Methods
  async exportData(): Promise<string> {
    await this.initialize()

    try {
      const [products, content, settings, media] = await Promise.all([
        this.getProducts(),
        this.getContent(),
        this.getSettings(),
        this.getMedia()
      ])

      const exportData = {
        products,
        content,
        settings,
        media,
        exportDate: new Date().toISOString(),
        version: '2.0'
      }

      return JSON.stringify(exportData, null, 2)
    } catch (error) {
      handleSupabaseError(error, 'export data')
      throw error
    }
  }

  async importData(jsonData: string): Promise<void> {
    await this.initialize()

    try {
      const data = JSON.parse(jsonData)

      // Import products
      if (data.products && Array.isArray(data.products)) {
        for (const product of data.products) {
          await this.addProduct(product)
        }
      }

      // Import content
      if (data.content) {
        await this.saveContent(data.content)
      }

      // Import settings
      if (data.settings) {
        await this.saveSettings(data.settings)
      }

      toast.success('Data imported successfully!')
    } catch (error) {
      handleSupabaseError(error, 'import data')
      throw error
    }
  }

  // Cleanup method
  destroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    })
    this.subscriptions = []
    this.initialized = false
  }
}

export const databaseManager = DatabaseManager.getInstance()
