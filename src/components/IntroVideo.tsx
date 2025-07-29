"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import VideoFallback from './VideoFallback'

interface IntroVideoProps {
  className?: string
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
  loop?: boolean
}

const IntroVideo: React.FC<IntroVideoProps> = ({
  className = "",
  autoplay = true,
  muted = true,
  controls = false,
  loop = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(muted)
  const [showControls, setShowControls] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
  }

  const handleVideoPlay = () => {
    setIsPlaying(true)
    setIsLoaded(true)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
  }

  const handleVideoLoaded = () => {
    console.log('🎥 Video loaded successfully')
    setIsLoaded(true)
    setHasError(false)
  }

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.target as HTMLVideoElement
    const error = video.error

    console.error('🎥 Video error details:', {
      error: error,
      code: error?.code,
      message: error?.message,
      src: video.src,
      networkState: video.networkState,
      readyState: video.readyState
    })

    setHasError(true)
    setIsLoaded(false)
  }

  const retryVideo = () => {
    setHasError(false)
    setIsLoaded(false)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }

  // Check if video file exists on component mount
  useEffect(() => {
    const checkVideoFile = async () => {
      try {
        const response = await fetch('/Intro.mp4', { method: 'HEAD' })
        if (!response.ok) {
          console.error('🎥 Video file not accessible:', response.status, response.statusText)
          setHasError(true)
        } else {
          console.log('🎥 Video file is accessible, size:', response.headers.get('content-length'), 'bytes')
        }
      } catch (error) {
        console.error('🎥 Failed to check video file:', error)
        setHasError(true)
      }
    }

    checkVideoFile()
  }, [])

  return (
    <div 
      className={`relative group overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        controls={controls}
        onEnded={handleVideoEnd}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        playsInline
        preload="auto"
        poster="/placeholder.svg?height=320&width=600&text=Loading+Video"
      >
        <source src="/Intro.mp4" type="video/mp4" />
        <p className="text-gray-600 p-4 bg-gray-100 rounded">
          Your browser does not support the video tag.
          <a href="/Intro.mp4" className="text-blue-600 hover:underline ml-1">
            Download the video
          </a>
        </p>
      </video>

      {/* Custom Controls Overlay */}
      {!controls && (
        <div 
          className={`absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 transform hover:scale-110"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause size={24} className="text-gray-800" />
              ) : (
                <Play size={24} className="text-gray-800 ml-1" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200 transform hover:scale-110"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? (
                <VolumeX size={20} className="text-gray-800" />
              ) : (
                <Volume2 size={20} className="text-gray-800" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gold font-medium">Loading video...</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 z-10">
          <VideoFallback
            className="w-full h-full rounded-xl"
            onRetry={retryVideo}
          />
        </div>
      )}
    </div>
  )
}

export default IntroVideo
