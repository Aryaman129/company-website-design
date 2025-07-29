"use client"

import React from 'react'
import { Play } from 'lucide-react'

interface VideoFallbackProps {
  className?: string
  onRetry?: () => void
}

const VideoFallback: React.FC<VideoFallbackProps> = ({ 
  className = "",
  onRetry 
}) => {
  return (
    <div className={`relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Content */}
      <div className="relative text-center text-white p-8">
        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Play size={32} className="text-gold ml-1" />
        </div>
        
        <h3 className="text-xl font-semibold mb-3">Company Introduction</h3>
        <p className="text-gray-300 mb-6 max-w-md">
          Experience our journey of excellence since 1985. 
          Building trust through quality construction and reliable service.
        </p>
        
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-gold hover:bg-gold-dark text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Try Loading Video Again
            </button>
          )}
          
          <div>
            <a
              href="/Intro.mp4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light underline text-sm"
            >
              Download Video File
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-gold rounded-full opacity-60"></div>
      <div className="absolute top-8 right-6 w-1 h-1 bg-gold rounded-full opacity-40"></div>
      <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-gold rounded-full opacity-50"></div>
      <div className="absolute bottom-4 right-4 w-2 h-2 bg-gold rounded-full opacity-30"></div>
    </div>
  )
}

export default VideoFallback
