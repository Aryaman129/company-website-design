"use client"

import React, { useRef, useEffect, useState } from 'react'

const VideoTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoStatus, setVideoStatus] = useState('Loading...')
  const [videoError, setVideoError] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadStart = () => {
      console.log('🎥 Video load started')
      setVideoStatus('Loading started...')
    }

    const handleLoadedMetadata = () => {
      console.log('🎥 Video metadata loaded')
      setVideoStatus('Metadata loaded')
    }

    const handleLoadedData = () => {
      console.log('🎥 Video data loaded')
      setVideoStatus('Data loaded')
    }

    const handleCanPlay = () => {
      console.log('🎥 Video can play')
      setVideoStatus('Ready to play')
    }

    const handlePlay = () => {
      console.log('🎥 Video playing')
      setVideoStatus('Playing')
    }

    const handleError = (e: Event) => {
      console.error('🎥 Video error:', e)
      const error = (e.target as HTMLVideoElement)?.error
      setVideoError(`Error ${error?.code}: ${error?.message || 'Unknown error'}`)
      setVideoStatus('Error')
    }

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('play', handlePlay)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4">Video Test Component</h3>
      
      <div className="mb-4">
        <p><strong>Status:</strong> <span className="text-blue-600">{videoStatus}</span></p>
        {videoError && (
          <p><strong>Error:</strong> <span className="text-red-600">{videoError}</span></p>
        )}
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/Intro.mp4" type="video/mp4" />
          <p className="text-white p-4">
            Your browser does not support the video tag.
            <br />
            <a href="/Intro.mp4" className="text-blue-400 underline">
              Download the video directly
            </a>
          </p>
        </video>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Video file path: <code>/Intro.mp4</code></p>
        <p>Expected location: <code>public/Intro.mp4</code></p>
      </div>
    </div>
  )
}

export default VideoTest
