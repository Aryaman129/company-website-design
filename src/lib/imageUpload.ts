// Image upload utilities - S3-compatible Supabase Storage
import { supabase } from './supabase'
import { uploadImageS3, testS3Connection, getS3ConfigStatus } from './s3ImageUpload'
import toast from 'react-hot-toast'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

class ImageUploadManager {
  private static instance: ImageUploadManager
  private bucketName = 'website-images'

  static getInstance(): ImageUploadManager {
    if (!ImageUploadManager.instance) {
      ImageUploadManager.instance = new ImageUploadManager()
    }
    return ImageUploadManager.instance
  }

  // Initialize storage bucket with detailed debugging
  async initializeBucket(): Promise<void> {
    try {
      console.log('🔍 Checking if bucket exists...')

      // Check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()

      if (listError) {
        console.error('❌ Error listing buckets:', listError)
        throw new Error(`Failed to list buckets: ${listError.message}`)
      }

      console.log('📋 Available buckets:', buckets?.map(b => ({ name: b.name, public: b.public })))

      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName)

      if (bucketExists) {
        console.log('✅ Bucket exists:', this.bucketName)

        // Check if bucket is public
        const bucket = buckets?.find(b => b.name === this.bucketName)
        if (bucket) {
          console.log('🔧 Bucket configuration:', {
            name: bucket.name,
            public: bucket.public,
            fileSizeLimit: bucket.file_size_limit,
            allowedMimeTypes: bucket.allowed_mime_types
          })

          if (!bucket.public) {
            console.warn('⚠️ Bucket is not public! This may cause issues.')
          }
        }
      } else {
        console.log('❌ Bucket does not exist, attempting to create...')

        // Create bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(this.bucketName, {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        })

        if (createError) {
          console.error('❌ Error creating bucket:', createError)
          throw new Error(`Failed to create bucket: ${createError.message}`)
        } else {
          console.log('✅ Storage bucket created successfully')
        }
      }
    } catch (error: any) {
      console.error('💥 Error initializing storage bucket:', error)
      throw error
    }
  }

  // Upload a single image file with detailed debugging
  async uploadImage(file: File, folder: string = 'general'): Promise<UploadResult> {
    try {
      console.log('🔍 Validating file...')

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error(`Invalid file type: ${file.type}. Must be an image.`)
      }

      if (file.size > 5242880) { // 5MB
        throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum 5MB allowed.`)
      }

      console.log('✅ File validation passed')

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      console.log('📝 Generated filename:', fileName)
      console.log('🪣 Using bucket:', this.bucketName)

      // Upload to Supabase Storage
      console.log('📤 Uploading to Supabase Storage...')
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      console.log('📤 Upload response:', { data, error })

      if (error) {
        console.error('❌ Supabase Storage error:', error)
        throw new Error(`Storage upload failed: ${error.message}`)
      }

      console.log('✅ File uploaded successfully:', data)

      // Get public URL
      console.log('🔗 Getting public URL...')
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName)

      console.log('🔗 Public URL generated:', urlData.publicUrl)

      return {
        url: urlData.publicUrl,
        path: fileName
      }
    } catch (error: any) {
      console.error('💥 Image upload error:', error)
      return {
        url: '',
        path: '',
        error: error.message || 'Upload failed'
      }
    }
  }

  // Upload multiple images
  async uploadImages(files: File[], folder: string = 'general'): Promise<UploadResult[]> {
    const results: UploadResult[] = []
    
    for (const file of files) {
      const result = await this.uploadImage(file, folder)
      results.push(result)
    }

    return results
  }

  // Delete an image
  async deleteImage(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([path])

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error('Image deletion error:', error)
      return false
    }
  }

  // Get public URL for an image path
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  // Fallback: Create object URL for local development
  createLocalUrl(file: File): string {
    return URL.createObjectURL(file)
  }

  // Production upload: Always attempt Supabase Storage with detailed debugging
  async smartUpload(file: File, folder: string = 'general'): Promise<string> {
    console.log('🚀 Starting image upload process...')
    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      folder: folder
    })

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('🔧 Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
      keyLength: supabaseKey ? supabaseKey.length : 0
    })

    if (!supabaseUrl || !supabaseKey) {
      const error = 'Missing Supabase environment variables'
      console.error('❌', error)
      toast.error('Supabase not configured. Check your .env.local file.')
      throw new Error(error)
    }

    // Check if user has forced local storage
    const forceLocal = localStorage.getItem('force_local_storage') === 'true'
    if (forceLocal) {
      console.log('⚠️ Local storage forced by user setting')
      toast.info('Using local storage (user preference). Toggle in admin dashboard.')
      return this.createLocalUrl(file)
    }

    try {
      console.log('🔄 Initializing Supabase Storage bucket...')
      await this.initializeBucket()

      console.log('📤 Attempting Supabase upload...')
      const result = await this.uploadImage(file, folder)

      if (result.error) {
        console.error('❌ Supabase upload failed:', result.error)
        toast.error(`Upload failed: ${result.error}`)
        throw new Error(result.error)
      }

      console.log('✅ Upload successful:', result.url)
      toast.success('Image uploaded to Supabase Storage!')
      return result.url

    } catch (error: any) {
      console.error('💥 Upload process failed:', error)

      // Provide specific error messages
      if (error.message?.includes('row-level security')) {
        toast.error('Storage policies not configured. Check Supabase Storage policies.')
      } else if (error.message?.includes('bucket')) {
        toast.error('Storage bucket not found. Create "website-images" bucket in Supabase.')
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error. Check your internet connection.')
      } else {
        toast.error(`Upload failed: ${error.message || 'Unknown error'}`)
      }

      throw error // Don't fallback to local storage - let the error bubble up
    }
  }

  // Batch smart upload
  async smartUploadMultiple(files: File[], folder: string = 'general'): Promise<string[]> {
    const urls: string[] = []
    
    for (const file of files) {
      const url = await this.smartUpload(file, folder)
      urls.push(url)
    }

    return urls
  }
}

export const imageUploadManager = ImageUploadManager.getInstance()

// Utility functions - now using S3-compatible API
export const uploadImage = (file: File, folder?: string) =>
  uploadImageS3(file, folder)

export const uploadImages = async (files: File[], folder?: string) => {
  const urls: string[] = []
  for (const file of files) {
    const url = await uploadImageS3(file, folder)
    urls.push(url)
  }
  return urls
}

export const deleteImage = (path: string) =>
  imageUploadManager.deleteImage(path)

export const getImageUrl = (path: string) =>
  imageUploadManager.getPublicUrl(path)

// S3-specific utilities
export const testStorageConnection = () => testS3Connection()
export const getStorageConfigStatus = () => getS3ConfigStatus()
