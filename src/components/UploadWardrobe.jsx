import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UploadWardrobe({ onBack, onComplete }) {
  console.log('UploadWardrobe component rendered!')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isClassifying, setIsClassifying] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = async (files) => {
    const imageFiles = files.filter(file => 
      file.type === 'image/png' || 
      file.type === 'image/jpeg' || 
      file.type === 'image/jpg' || 
      file.type === 'image/webp'
    )

    setIsProcessing(true)

    // Convert to base64 for localStorage
    const promises = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve({
            name: file.name,
            data: reader.result,
            type: file.type,
            timestamp: Date.now()
          })
        }
        reader.readAsDataURL(file)
      })
    })

    const newImages = await Promise.all(promises)
    const allImages = [...uploadedImages, ...newImages]
    setUploadedImages(allImages)

    // Save to localStorage
    localStorage.setItem('wardrobeImages', JSON.stringify(allImages))

    setIsProcessing(false)
  }

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
    localStorage.setItem('wardrobeImages', JSON.stringify(newImages))
  }

  const handleContinue = async () => {
    if (uploadedImages.length === 0) return
    
    setIsClassifying(true)
    
    // Simulate processing time for better UX
    setTimeout(() => {
      console.log('Opening classifier with uploaded images...')
      console.log('Number of images to send:', uploadedImages.length)
      
      // Open the classifier app
      const classifierWindow = window.open('http://localhost:5173', '_blank')
      
      // Wait a bit for the window to load, then send the data via postMessage
      setTimeout(() => {
        if (classifierWindow) {
          const messageData = {
            type: 'LOAD_WARDROBE',
            images: uploadedImages
          };
          classifierWindow.postMessage(messageData, 'http://localhost:5173')
          console.log('Sent wardrobe data to classifier via postMessage:', messageData.images.length, 'images')
        } else {
          console.error('Failed to open classifier window!')
        }
      }, 2000) // Give the window time to load
      
      setIsClassifying(false)
      onComplete(uploadedImages)
    }, 1000)
  }

  // Load existing images on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('wardrobeImages')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUploadedImages(parsed)
      } catch (e) {
        console.error('Error loading saved images:', e)
      }
    }
  }, [])

  return (
    <div className="upload-wardrobe">
      <motion.button 
        className="back-button" 
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -6 }}
      >
        ← Back
      </motion.button>

      <motion.div 
        className="upload-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="upload-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Upload Your Wardrobe
        </motion.h1>

        <motion.p 
          className="upload-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Add photos of your clothes to get personalized outfit recommendations
        </motion.p>

        <motion.div
          className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />

          <motion.div 
            className="upload-icon"
            animate={{ 
              y: isDragging ? -10 : [0, -8, 0],
            }}
            transition={{ 
              duration: isDragging ? 0.3 : 2,
              repeat: isDragging ? 0 : Infinity,
              ease: "easeInOut"
            }}
          >
            📤
          </motion.div>

          <h3>{isDragging ? 'Drop your photos here!' : 'Drag & drop your photos here'}</h3>
          <p>or click to select files</p>
          <span className="upload-formats">PNG, JPG, WEBP accepted</span>

          {isProcessing && (
            <motion.div 
              className="processing-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Processing...
            </motion.div>
          )}
        </motion.div>

        {uploadedImages.length > 0 && (
          <motion.div 
            className="uploaded-gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Your Wardrobe ({uploadedImages.length} items)</h3>
            <div className="gallery-grid">
              <AnimatePresence>
                {uploadedImages.map((img, index) => (
                  <motion.div
                    key={index}
                    className="gallery-item"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={img.data} alt={img.name} />
                    <button 
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              className="btn-primary continue-btn"
              onClick={handleContinue}
              disabled={isClassifying}
              whileHover={{ scale: isClassifying ? 1 : 1.05 }}
              whileTap={{ scale: isClassifying ? 1 : 0.95 }}
            >
              {isClassifying ? 'Saving...' : 'Save'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
