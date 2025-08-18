'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Camera, Upload, RotateCcw, Check, X, ChevronDown } from 'lucide-react'

interface CameraDevice {
  deviceId: string
  label: string
}

export default function UploadPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCamera, setIsCamera] = useState(false)
  const [error, setError] = useState<string>('')
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [availableDevices, setAvailableDevices] = useState<CameraDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('')
  const [showDeviceSelector, setShowDeviceSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Get available camera devices
  const getAvailableDevices = useCallback(async () => {
    try {
      // Request permission first to get device labels
      const permissionStream = await navigator.mediaDevices.getUserMedia({ video: true })
      permissionStream.getTracks().forEach(track => track.stop())
      
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`
        }))
      
      setAvailableDevices(videoDevices)
      
      // Set default device if none selected
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId)
      }
      
    } catch (err) {
      console.error('Error getting devices:', err)
      setError('Unable to access camera devices')
    }
  }, [selectedDeviceId])

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setError('')
      setIsLoading(true)
      
      // Set a timeout to clear loading state if camera doesn't start
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false)
        setError('Camera is taking too long to start. Please try again.')
      }, 10000) // 10 second timeout
      
      // Get devices if not already loaded
      if (availableDevices.length === 0) {
        await getAvailableDevices()
      }
      
      // Wait for video element to be available (retry logic)
      let retryCount = 0
      const maxRetries = 10
      while (!videoRef.current && retryCount < maxRetries) {
        console.log(`Waiting for video element... retry ${retryCount + 1}`)
        await new Promise(resolve => setTimeout(resolve, 100))
        retryCount++
      }
      
      if (!videoRef.current) {
        clearTimeout(loadingTimeout)
        setIsLoading(false)
        setError('Video element is not ready. Please try again.')
        return
      }
      
      // Simplified constraints - start with basic setup
      let constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      }

      // Add device-specific constraints
      if (selectedDeviceId) {
        constraints.video = {
          ...constraints.video as object,
          deviceId: { exact: selectedDeviceId }
        }
      } else {
        constraints.video = {
          ...constraints.video as object,
          facingMode: facingMode
        }
      }
      
      console.log('Starting camera with constraints:', constraints)
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('Got media stream:', mediaStream)
      console.log('Stream tracks:', mediaStream.getVideoTracks())
      
      // Check if stream has active video tracks
      const videoTracks = mediaStream.getVideoTracks()
      if (videoTracks.length === 0) {
        clearTimeout(loadingTimeout)
        setIsLoading(false)
        setError('No video track found in camera stream')
        return
      }
      
      console.log('Video track state:', videoTracks[0].readyState)
      console.log('Video track enabled:', videoTracks[0].enabled)
      
      setStream(mediaStream)
      
      // Set up video element (now we know it exists)
      const video = videoRef.current
      
      // Clear any existing event listeners
      video.onloadedmetadata = null
      video.onerror = null
      video.onplaying = null
      
      video.srcObject = mediaStream
      
      // Add event handlers
      video.onloadedmetadata = () => {
        console.log('Video metadata loaded')
        clearTimeout(loadingTimeout)
        setIsLoading(false)
        console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight)
        video.play().catch(err => {
          console.error('Error playing video:', err)
          setError('Unable to start camera preview')
        })
      }
      
      video.onerror = (err) => {
        console.error('Video element error:', err)
        clearTimeout(loadingTimeout)
        setIsLoading(false)
        setError('Camera preview error')
      }
      
      video.onplaying = () => {
        console.log('Video is now playing')
        clearTimeout(loadingTimeout)
        setIsLoading(false)
      }
      
      // Force load the video
      video.load()
      
      // Additional fallback - try to play after a short delay
      setTimeout(() => {
        if (video.readyState >= 2) {
          console.log('Fallback: Attempting to play video')
          video.play().then(() => {
            clearTimeout(loadingTimeout)
            setIsLoading(false)
          }).catch(err => {
            console.error('Fallback play failed:', err)
            clearTimeout(loadingTimeout)
            setIsLoading(false)
            setError('Camera preview failed to start')
          })
        }
      }, 1000)
      
      // Final fallback - clear loading after 3 seconds regardless
      setTimeout(() => {
        if (isLoading) {
          console.log('Final fallback: Clearing loading state')
          clearTimeout(loadingTimeout)
          setIsLoading(false)
        }
      }, 3000)
      
      setIsCamera(true)
    } catch (err) {
      setIsLoading(false)
      console.error('Error accessing camera:', err)
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions and refresh the page.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please check your camera connection.')
        } else if (err.name === 'NotReadableError') {
          setError('Camera is already in use by another application.')
        } else if (err.name === 'OverconstrainedError') {
          setError('Camera does not support the requested settings. Try a different camera.')
        } else {
          setError(`Camera error: ${err.message}`)
        }
      } else {
        setError('Unable to access camera')
      }
    }
  }, [facingMode, selectedDeviceId, availableDevices.length, getAvailableDevices, isLoading])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCamera(false)
  }, [stream])

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }, [stopCamera])

  // Handle file selection from gallery
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Toggle camera facing mode (fallback for mobile devices)
  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    if (isCamera) {
      stopCamera()
      setTimeout(() => startCamera(), 100)
    }
  }, [isCamera, stopCamera, startCamera])

  // Handle device selection
  const handleDeviceSelect = useCallback((deviceId: string) => {
    setSelectedDeviceId(deviceId)
    setShowDeviceSelector(false)
    if (isCamera) {
      stopCamera()
      setTimeout(() => startCamera(), 100)
    }
  }, [isCamera, stopCamera, startCamera])

  // Reset to initial state
  const reset = useCallback(() => {
    setCapturedImage(null)
    stopCamera()
    setError('')
  }, [stopCamera])

  // Load available devices on mount
  useEffect(() => {
    getAvailableDevices()
  }, [getAvailableDevices])

  // Ensure video element is ready when camera mode is activated
  useEffect(() => {
    if (isCamera && !stream && videoRef.current) {
      console.log('Camera mode activated, video element ready')
      // Small delay to ensure DOM is fully rendered
      setTimeout(startCamera, 100)
    }
  }, [isCamera, stream, startCamera])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {!isCamera && !capturedImage && (
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Photo</h1>
          
          {/* Device Selector */}
          {availableDevices.length > 1 && (
            <div className="relative mb-4">
              <button
                onClick={() => setShowDeviceSelector(!showDeviceSelector)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Camera size={16} />
                <span className="text-sm">
                  {availableDevices.find(d => d.deviceId === selectedDeviceId)?.label || 'Select Camera'}
                </span>
                <ChevronDown size={16} />
              </button>
              
              {showDeviceSelector && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {availableDevices.map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => handleDeviceSelect(device.deviceId)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        selectedDeviceId === device.deviceId ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {device.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Camera Button */}
          <button
            onClick={() => setIsCamera(true)}
            disabled={isLoading}
            className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
          >
            <Camera size={24} />
            <span>{isLoading ? 'Starting...' : 'Take Photo'}</span>
          </button>

          {/* Gallery Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
          >
            <Upload size={24} />
            <span>Choose from Gallery</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Camera View */}
      {isCamera && (
        <div className="relative w-full max-w-lg mx-auto">
          {/* Device Selector in Camera Mode */}
          {availableDevices.length > 1 && (
            <div className="relative mb-4">
              <button
                onClick={() => setShowDeviceSelector(!showDeviceSelector)}
                className="flex items-center space-x-2 px-3 py-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors text-sm"
              >
                <Camera size={14} />
                <span>
                  {availableDevices.find(d => d.deviceId === selectedDeviceId)?.label || 'Camera'}
                </span>
                <ChevronDown size={14} />
              </button>
              
              {showDeviceSelector && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {availableDevices.map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => handleDeviceSelect(device.deviceId)}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-sm ${
                        selectedDeviceId === device.deviceId ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {device.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
              style={{ minHeight: '300px' }}
            />
            
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="mb-3">Starting camera...</p>
                  <button
                    onClick={() => {
                      setIsLoading(false)
                      stopCamera()
                      setTimeout(startCamera, 500)
                    }}
                    className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded text-sm transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Vertical lines */}
                <line x1="33.33" y1="0" x2="33.33" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
                <line x1="66.66" y1="0" x2="66.66" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
                {/* Horizontal lines */}
                <line x1="0" y1="33.33" x2="100" y2="33.33" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
                <line x1="0" y1="66.66" x2="100" y2="66.66" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" />
              </svg>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={stopCamera}
              className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <button
              onClick={capturePhoto}
              className="p-4 bg-white border-4 border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </button>
            
            {/* Show toggle button only if no specific device selected (mobile fallback) */}
            {!selectedDeviceId && (
              <button
                onClick={toggleCamera}
                className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {capturedImage && (
        <div className="w-full max-w-lg mx-auto">
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={reset}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <X size={18} />
              <span>Retake</span>
            </button>
            
            <button
              onClick={() => {
                // Handle image upload logic here
                console.log('Image ready for upload:', capturedImage)
                alert('Image ready for upload!')
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Check size={18} />
              <span>Use Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Debug section */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm max-w-lg w-full">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p><strong>Available Devices:</strong> {availableDevices.length}</p>
          <p><strong>Selected Device:</strong> {selectedDeviceId || 'None'}</p>
          <p><strong>Camera Active:</strong> {isCamera ? 'Yes' : 'No'}</p>
          <p><strong>Stream Active:</strong> {stream ? 'Yes' : 'No'}</p>
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Facing Mode:</strong> {facingMode}</p>
          
          <button
            onClick={() => {
              console.log('=== Camera Debug Info ===')
              console.log('Available devices:', availableDevices)
              console.log('Selected device:', selectedDeviceId)
              console.log('Stream:', stream)
              console.log('Video element:', videoRef.current)
              console.log('Is camera:', isCamera)
              console.log('Is loading:', isLoading)
              if (videoRef.current) {
                console.log('Video ready state:', videoRef.current.readyState)
                console.log('Video paused:', videoRef.current.paused)
                console.log('Video src:', videoRef.current.srcObject)
              }
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Log Debug Info
          </button>
        </div>
      )}
    </div>
  )
}
