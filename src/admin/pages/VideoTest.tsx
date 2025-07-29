"use client"

import React from 'react'
import IntroVideo from '../../components/IntroVideo'
import VideoTest from '../../components/VideoTest'

const VideoTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Video Testing Page</h1>
          <p className="text-gray-600">Test video playback and troubleshoot issues</p>
        </div>

        {/* Direct Video Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Direct HTML5 Video Test</h2>
          <div className="bg-black rounded-lg overflow-hidden">
            <video 
              className="w-full h-64 object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/Intro.mp4" type="video/mp4" />
              <p className="text-white p-4">Your browser does not support the video tag.</p>
            </video>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This is a direct HTML5 video element with controls enabled for testing.
          </p>
        </div>

        {/* IntroVideo Component Test */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">IntroVideo Component Test</h2>
          <div className="relative">
            <IntroVideo 
              className="w-full h-64 rounded-lg"
              autoplay={true}
              muted={true}
              loop={true}
              controls={false}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This is the IntroVideo component used in the Home and About pages.
          </p>
        </div>

        {/* VideoTest Component */}
        <VideoTest />

        {/* Video File Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Video File Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>File Path:</strong> <code>/Intro.mp4</code></p>
            <p><strong>Expected Location:</strong> <code>public/Intro.mp4</code></p>
            <p><strong>File Size:</strong> ~18MB</p>
            <p><strong>Format:</strong> MP4</p>
          </div>
          
          <div className="mt-4">
            <a 
              href="/Intro.mp4" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Open Video File Directly
            </a>
          </div>
        </div>

        {/* Browser Compatibility */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Browser Compatibility Check</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User Agent:</strong> <span className="font-mono text-xs">{typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</span></p>
            <p><strong>Video Support:</strong> {typeof window !== 'undefined' && document.createElement('video').canPlayType ? '✅ Supported' : '❌ Not Supported'}</p>
            <p><strong>MP4 Support:</strong> {typeof window !== 'undefined' && document.createElement('video').canPlayType('video/mp4') ? '✅ Supported' : '❌ Not Supported'}</p>
            <p><strong>Autoplay Policy:</strong> Check browser console for autoplay restrictions</p>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">Troubleshooting Guide</h2>
          <div className="space-y-3 text-sm text-yellow-700">
            <div>
              <strong>If video doesn't play:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>Check if the video file exists at <code>/Intro.mp4</code></li>
                <li>Verify the video format is compatible (MP4 H.264)</li>
                <li>Check browser console for autoplay policy restrictions</li>
                <li>Try enabling controls and manually clicking play</li>
                <li>Check if the video file is corrupted or too large</li>
              </ul>
            </div>
            
            <div>
              <strong>If video loads but doesn't autoplay:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>Modern browsers require user interaction for autoplay</li>
                <li>Ensure the video is muted for autoplay to work</li>
                <li>Check browser autoplay settings</li>
              </ul>
            </div>
            
            <div>
              <strong>If video covers the "35+ Years" badge:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>The badge should have <code>z-20</code> to appear above video</li>
                <li>Check if the badge positioning is correct</li>
                <li>Verify the video container doesn't overflow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoTestPage
