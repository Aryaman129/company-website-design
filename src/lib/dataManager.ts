// Data Manager - Handles all website data persistence and management
import toast from "react-hot-toast"

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
    videoUrl: string
    videoPoster: string
    logo: string
    buttons: {
      primary: { text: string; link: string }
      secondary: { text: string; link: string }
    }
  }
  stats: Array<{
    number: number
    suffix: string
    label: string
    icon: string
  }>
  about: {
    title: string
    description: string
    image: string
    features: string[]
    yearsBadge: { number: string; text: string }
  }
  testimonials: Testimonial[]
  cta: {
    title: string
    description: string
    buttons: {
      primary: { text: string; link: string }
      secondary: { text: string; link: string }
    }
  }
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

class DataManager {
  private static instance: DataManager
  private initialized = false

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Initialize with default data if not exists
      await this.initializeDefaultData()
      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize data manager:', error)
      throw error
    }
  }

  private async initializeDefaultData(): Promise<void> {
    // Check if data exists in localStorage, if not, load from JSON files
    const existingProducts = localStorage.getItem('website_products')
    const existingContent = localStorage.getItem('website_content')
    const existingSettings = localStorage.getItem('website_settings')
    const existingMedia = localStorage.getItem('website_media')

    if (!existingProducts) {
      try {
        const response = await fetch('/data/products.json')
        const products = await response.json()
        localStorage.setItem('website_products', JSON.stringify(products))
      } catch (error) {
        console.error('Failed to load default products:', error)
      }
    }

    if (!existingContent) {
      try {
        const response = await fetch('/data/content.json')
        const content = await response.json()
        localStorage.setItem('website_content', JSON.stringify(content))
      } catch (error) {
        console.error('Failed to load default content:', error)
      }
    }

    if (!existingSettings) {
      try {
        const response = await fetch('/data/settings.json')
        const settings = await response.json()
        localStorage.setItem('website_settings', JSON.stringify(settings))
      } catch (error) {
        console.error('Failed to load default settings:', error)
      }
    }

    if (!existingMedia) {
      // Initialize with empty media library
      const defaultMedia: MediaItem[] = []
      localStorage.setItem('website_media', JSON.stringify(defaultMedia))
    }
  }

  // Products Management
  async getProducts(): Promise<Product[]> {
    await this.initialize()
    const data = localStorage.getItem('website_products')
    return data ? JSON.parse(data) : []
  }

  async saveProducts(products: Product[]): Promise<void> {
    localStorage.setItem('website_products', JSON.stringify(products))
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const products = await this.getProducts()
    const newProduct: Product = {
      ...product,
      id: Math.max(0, ...products.map(p => p.id)) + 1
    }
    products.unshift(newProduct)
    await this.saveProducts(products)
    return newProduct
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<void> {
    const products = await this.getProducts()
    const index = products.findIndex(p => p.id === id)
    if (index !== -1) {
      products[index] = { ...products[index], ...updates }
      await this.saveProducts(products)
    }
  }

  async deleteProduct(id: number): Promise<void> {
    const products = await this.getProducts()
    const filtered = products.filter(p => p.id !== id)
    await this.saveProducts(filtered)
  }

  // Content Management
  async getContent(): Promise<ContentData> {
    await this.initialize()
    const data = localStorage.getItem('website_content')
    return data ? JSON.parse(data) : {}
  }

  async saveContent(content: ContentData): Promise<void> {
    localStorage.setItem('website_content', JSON.stringify(content))
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Settings Management
  async getSettings(): Promise<SettingsData> {
    await this.initialize()
    const data = localStorage.getItem('website_settings')
    return data ? JSON.parse(data) : {}
  }

  async saveSettings(settings: SettingsData): Promise<void> {
    localStorage.setItem('website_settings', JSON.stringify(settings))
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Media Management
  async getMedia(): Promise<MediaItem[]> {
    await this.initialize()
    const data = localStorage.getItem('website_media')
    return data ? JSON.parse(data) : []
  }

  async saveMedia(media: MediaItem[]): Promise<void> {
    localStorage.setItem('website_media', JSON.stringify(media))
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  async addMediaItem(file: File, category: string = 'general'): Promise<MediaItem> {
    const media = await this.getMedia()
    
    // Create object URL for the file (in production, this would be uploaded to server)
    const url = URL.createObjectURL(file)
    
    const mediaItem: MediaItem = {
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      url,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      category,
      alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      size: file.size,
      uploadDate: new Date().toISOString()
    }
    
    media.unshift(mediaItem)
    await this.saveMedia(media)
    return mediaItem
  }

  async deleteMediaItem(id: string): Promise<void> {
    const media = await this.getMedia()
    const filtered = media.filter(m => m.id !== id)
    await this.saveMedia(filtered)
  }

  // Testimonials Management
  async addTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> {
    const content = await this.getContent()
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: Math.max(0, ...content.testimonials.map(t => t.id)) + 1
    }
    content.testimonials.unshift(newTestimonial)
    await this.saveContent(content)
    return newTestimonial
  }

  async updateTestimonial(id: number, updates: Partial<Testimonial>): Promise<void> {
    const content = await this.getContent()
    const index = content.testimonials.findIndex(t => t.id === id)
    if (index !== -1) {
      content.testimonials[index] = { ...content.testimonials[index], ...updates }
      await this.saveContent(content)
    }
  }

  async deleteTestimonial(id: number): Promise<void> {
    const content = await this.getContent()
    content.testimonials = content.testimonials.filter(t => t.id !== id)
    await this.saveContent(content)
  }

  // Utility methods
  async exportData(): Promise<string> {
    const products = await this.getProducts()
    const content = await this.getContent()
    const settings = await this.getSettings()
    const media = await this.getMedia()

    return JSON.stringify({
      products,
      content,
      settings,
      media,
      exportDate: new Date().toISOString()
    }, null, 2)
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.products) await this.saveProducts(data.products)
      if (data.content) await this.saveContent(data.content)
      if (data.settings) await this.saveSettings(data.settings)
      if (data.media) await this.saveMedia(data.media)
      
      toast.success('Data imported successfully!')
    } catch (error) {
      toast.error('Failed to import data. Please check the file format.')
      throw error
    }
  }
}

export const dataManager = DataManager.getInstance()
