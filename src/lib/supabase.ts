// Supabase client configuration for database operations
import { createClient } from '@supabase/supabase-js'

// Database schema types
export interface DatabaseProduct {
  id: number
  name: string
  category: string
  description: string
  image: string
  features: string[]
  price: string
  specifications: Record<string, any>
  in_stock: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

export interface DatabaseContent {
  id: number
  section: string
  data: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DatabaseSettings {
  id: number
  key: string
  value: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DatabaseMedia {
  id: string
  name: string
  url: string
  type: 'image' | 'video'
  category: string
  alt?: string
  size: number
  upload_date: string
  created_at: string
  updated_at: string
}

export interface DatabaseTestimonial {
  id: number
  name: string
  company: string
  text: string
  rating: number
  image: string
  created_at: string
  updated_at: string
}

// Database schema definition
export type Database = {
  public: {
    Tables: {
      products: {
        Row: DatabaseProduct
        Insert: Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseProduct, 'id' | 'created_at' | 'updated_at'>>
      }
      content: {
        Row: DatabaseContent
        Insert: Omit<DatabaseContent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseContent, 'id' | 'created_at' | 'updated_at'>>
      }
      settings: {
        Row: DatabaseSettings
        Insert: Omit<DatabaseSettings, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseSettings, 'id' | 'created_at' | 'updated_at'>>
      }
      media: {
        Row: DatabaseMedia
        Insert: Omit<DatabaseMedia, 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseMedia, 'created_at' | 'updated_at'>>
      }
      testimonials: {
        Row: DatabaseTestimonial
        Insert: Omit<DatabaseTestimonial, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseTestimonial, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Real-time subscription helper
export const subscribeToTable = (
  table: keyof Database['public']['Tables'],
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
      },
      callback
    )
    .subscribe()
}

// Utility functions for data transformation
export const transformProductFromDB = (dbProduct: DatabaseProduct) => ({
  id: dbProduct.id,
  name: dbProduct.name,
  category: dbProduct.category,
  description: dbProduct.description,
  image: dbProduct.image,
  features: dbProduct.features,
  price: dbProduct.price,
  specifications: dbProduct.specifications,
  inStock: dbProduct.in_stock,
  featured: dbProduct.featured,
})

export const transformProductToDB = (product: any): Database['public']['Tables']['products']['Insert'] => ({
  name: product.name,
  category: product.category,
  description: product.description,
  image: product.image,
  features: product.features,
  price: product.price,
  specifications: product.specifications,
  in_stock: product.inStock,
  featured: product.featured,
})

export const transformMediaFromDB = (dbMedia: DatabaseMedia) => ({
  id: dbMedia.id,
  name: dbMedia.name,
  url: dbMedia.url,
  type: dbMedia.type,
  category: dbMedia.category,
  alt: dbMedia.alt,
  size: dbMedia.size,
  uploadDate: dbMedia.upload_date,
})

export const transformMediaToDB = (media: any): Database['public']['Tables']['media']['Insert'] => ({
  id: media.id,
  name: media.name,
  url: media.url,
  type: media.type,
  category: media.category,
  alt: media.alt,
  size: media.size,
  upload_date: media.uploadDate,
})

export const transformTestimonialFromDB = (dbTestimonial: DatabaseTestimonial) => ({
  id: dbTestimonial.id,
  name: dbTestimonial.name,
  company: dbTestimonial.company,
  text: dbTestimonial.text,
  rating: dbTestimonial.rating,
  image: dbTestimonial.image,
})

export const transformTestimonialToDB = (testimonial: any): Database['public']['Tables']['testimonials']['Insert'] => ({
  name: testimonial.name,
  company: testimonial.company,
  text: testimonial.text,
  rating: testimonial.rating,
  image: testimonial.image,
})

// Error handling helper
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error)
  
  if (error?.code === 'PGRST116') {
    throw new Error(`No data found for ${operation}`)
  } else if (error?.code === 'PGRST301') {
    throw new Error(`Duplicate data for ${operation}`)
  } else if (error?.message?.includes('JWT')) {
    throw new Error('Authentication required. Please log in.')
  } else if (error?.message?.includes('network')) {
    throw new Error('Network error. Please check your connection.')
  } else {
    throw new Error(`Failed to ${operation}: ${error?.message || 'Unknown error'}`)
  }
}

// Connection test function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1)
    if (error) throw error
    return true
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}
