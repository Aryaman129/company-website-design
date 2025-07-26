"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Image as ImageIcon, Check, Video, FileText } from "lucide-react"
import toast from "react-hot-toast"

interface MediaUploadProps {
  onUpload: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  maxSize?: number // in MB
  allowVideo?: boolean
  category?: string
}

const MediaUpload = ({
  onUpload,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSize = 10,
  allowVideo = false,
  category = 'general'
}: MediaUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  // Add video types if allowed
  const finalAcceptedTypes = allowVideo
    ? [...acceptedTypes, 'video/mp4', 'video/webm', 'video/ogg']
    : acceptedTypes

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} is too large. Max size is ${maxSize}MB`)
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} is not a supported file format`)
          } else {
            toast.error(`Error with ${file.name}: ${error.message}`)
          }
        })
      })
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles)
      setUploadedFiles(newFiles)
      toast.success(`${acceptedFiles.length} file(s) added`)
    }
  }, [uploadedFiles, maxFiles, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: finalAcceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    maxFiles,
    multiple: true
  })

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    toast.success("File removed")
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please select files to upload")
      return
    }

    setUploading(true)
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onUpload(uploadedFiles)
      setUploadedFiles([])
      toast.success("Files uploaded successfully!")
    } catch (error) {
      toast.error("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <motion.div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-gold bg-gold/5 scale-105' 
            : 'border-gray-300 hover:border-gold hover:bg-gold/5'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{ 
            y: isDragActive ? -10 : 0,
            scale: isDragActive ? 1.1 : 1
          }}
          className="space-y-4"
        >
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
            <Upload className="text-gold" size={24} />
          </div>
          
          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-gold">Drop files here!</p>
              <p className="text-gray-500">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drag & drop {allowVideo ? 'media files' : 'images'} here, or click to select
              </p>
              <p className="text-gray-500">
                Supports {allowVideo ? 'Images (JPEG, PNG, WebP, GIF) and Videos (MP4, WebM)' : 'JPEG, PNG, WebP, GIF'} up to {maxSize}MB each (max {maxFiles} files)
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* File Preview */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Files ({uploadedFiles.length})
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : file.type.startsWith('video/') ? (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Video size={32} />
                        <span className="text-xs mt-1">Video</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FileText size={32} />
                        <span className="text-xs mt-1">File</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end">
              <motion.button
                onClick={handleUpload}
                disabled={uploading}
                whileHover={{ scale: uploading ? 1 : 1.05 }}
                whileTap={{ scale: uploading ? 1 : 0.95 }}
                className="flex items-center space-x-2 bg-gold hover:bg-gold-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Upload Files</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MediaUpload

// Keep the old name for backward compatibility
export { MediaUpload as ImageUpload }
