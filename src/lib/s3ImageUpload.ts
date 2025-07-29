// S3-compatible image upload for Supabase Storage
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3'
import toast from 'react-hot-toast'

export interface UploadResult {
  url: string
  path: string
  error?: string
}

class S3ImageUploadManager {
  private static instance: S3ImageUploadManager
  private s3Client: S3Client | null = null
  private bucketName: string
  private endpoint: string
  private accessKeyId: string
  private secretAccessKey: string

  constructor() {
    this.endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT || ''
    this.accessKeyId = process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || ''
    this.secretAccessKey = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY || ''
    this.bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'website-images'

    // Clear any local storage override to ensure global persistence
    if (typeof window !== 'undefined') {
      localStorage.removeItem('force_local_storage')
      console.log('🌍 Cleared local storage override - ensuring global persistence')
    }
  }

  static getInstance(): S3ImageUploadManager {
    if (!S3ImageUploadManager.instance) {
      S3ImageUploadManager.instance = new S3ImageUploadManager()
    }
    return S3ImageUploadManager.instance
  }

  private initializeS3Client(): S3Client {
    if (!this.s3Client) {
      console.log('🔧 Initializing S3 client with endpoint:', this.endpoint)
      
      this.s3Client = new S3Client({
        endpoint: this.endpoint,
        region: 'us-east-1', // Supabase uses us-east-1 for S3 compatibility
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
        forcePathStyle: true, // Required for Supabase S3 compatibility
      })
    }
    return this.s3Client
  }

  // Test bucket connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing S3 bucket connection...')
      const s3 = this.initializeS3Client()
      
      const command = new HeadBucketCommand({
        Bucket: this.bucketName
      })
      
      await s3.send(command)
      console.log('✅ S3 bucket connection successful')
      return true
    } catch (error: any) {
      console.error('❌ S3 bucket connection failed:', error)
      return false
    }
  }

  // Upload a single image file using S3 API
  async uploadImage(file: File, folder: string = 'general'): Promise<UploadResult> {
    try {
      console.log('🚀 Starting S3 image upload...')
      console.log('📁 File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        folder: folder
      })

      // Validate environment variables
      if (!this.endpoint || !this.accessKeyId || !this.secretAccessKey) {
        throw new Error('Missing S3 configuration. Check your environment variables.')
      }

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

      // Initialize S3 client
      const s3 = this.initializeS3Client()

      // Convert file to buffer
      const buffer = await file.arrayBuffer()
      
      console.log('📤 Uploading to S3...')
      
      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: new Uint8Array(buffer),
        ContentType: file.type,
        CacheControl: 'max-age=3600',
        // Make the object publicly readable
        ACL: 'public-read'
      })

      const result = await s3.send(command)
      console.log('📤 S3 upload response:', result)

      // Construct public URL
      // For Supabase, the public URL format is: https://project.supabase.co/storage/v1/object/public/bucket/path
      const baseUrl = this.endpoint.replace('/storage/v1/s3', '')
      const publicUrl = `${baseUrl}/storage/v1/object/public/${this.bucketName}/${fileName}`
      
      console.log('🔗 Generated public URL:', publicUrl)

      return {
        url: publicUrl,
        path: fileName
      }
    } catch (error: any) {
      console.error('💥 S3 image upload error:', error)
      return {
        url: '',
        path: '',
        error: error.message || 'Upload failed'
      }
    }
  }

  // Delete an image
  async deleteImage(path: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting image:', path)
      const s3 = this.initializeS3Client()
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: path
      })

      await s3.send(command)
      console.log('✅ Image deleted successfully')
      return true
    } catch (error: any) {
      console.error('❌ Image deletion failed:', error)
      return false
    }
  }

  // Smart upload with comprehensive error handling
  async smartUpload(file: File, folder: string = 'general'): Promise<string> {
    console.log('🚀 Starting S3 smart upload process...')

    // Check environment variables
    console.log('🔧 Environment check:', {
      hasEndpoint: !!this.endpoint,
      hasAccessKey: !!this.accessKeyId,
      hasSecretKey: !!this.secretAccessKey,
      hasBucketName: !!this.bucketName,
      endpoint: this.endpoint ? `${this.endpoint.substring(0, 50)}...` : 'MISSING'
    })

    if (!this.endpoint || !this.accessKeyId || !this.secretAccessKey) {
      const error = 'Missing S3 configuration in environment variables'
      console.error('❌', error)
      toast.error('S3 Storage not configured. Check your .env.local file.')
      throw new Error(error)
    }

    // Force production mode - no local storage fallback for global persistence
    console.log('🌍 Production mode: All images will be stored globally in Supabase Storage')

    try {
      // Test connection first
      console.log('🔄 Testing S3 connection...')
      const connectionOk = await this.testConnection()
      
      if (!connectionOk) {
        throw new Error('S3 bucket connection failed')
      }

      console.log('📤 Attempting S3 upload...')
      const result = await this.uploadImage(file, folder)
      
      if (result.error) {
        console.error('❌ S3 upload failed:', result.error)
        toast.error(`Upload failed: ${result.error}`)
        throw new Error(result.error)
      }

      console.log('✅ Upload successful:', result.url)
      toast.success('Image uploaded to Supabase Storage via S3!')
      return result.url
      
    } catch (error: any) {
      console.error('💥 S3 upload process failed:', error)
      
      // Provide specific error messages
      if (error.message?.includes('credentials')) {
        toast.error('Invalid S3 credentials. Check your access keys.')
      } else if (error.message?.includes('bucket')) {
        toast.error('S3 bucket not accessible. Check bucket name and permissions.')
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error. Check your internet connection.')
      } else if (error.message?.includes('NoSuchBucket')) {
        toast.error('Bucket "website-images" not found. Create it in Supabase dashboard.')
      } else {
        toast.error(`Upload failed: ${error.message || 'Unknown error'}`)
      }
      
      throw error
    }
  }

  // Get configuration status
  getConfigStatus() {
    return {
      hasEndpoint: !!this.endpoint,
      hasAccessKey: !!this.accessKeyId,
      hasSecretKey: !!this.secretAccessKey,
      hasBucketName: !!this.bucketName,
      endpoint: this.endpoint,
      bucketName: this.bucketName
    }
  }
}

export const s3ImageUploadManager = S3ImageUploadManager.getInstance()

// Utility functions for easy use
export const uploadImageS3 = (file: File, folder?: string) => 
  s3ImageUploadManager.smartUpload(file, folder)

export const deleteImageS3 = (path: string) => 
  s3ImageUploadManager.deleteImage(path)

export const testS3Connection = () => 
  s3ImageUploadManager.testConnection()

export const getS3ConfigStatus = () => 
  s3ImageUploadManager.getConfigStatus()
