import { useState, useCallback } from 'react'

// Hook to generate image preview URL for uploads
export default function useUploadPreview() {
  const [preview, setPreview] = useState(null)

  const handleFile = useCallback((file) => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [])

  const clear = useCallback(() => setPreview(null), [])

  return { preview, handleFile, clear }
}
