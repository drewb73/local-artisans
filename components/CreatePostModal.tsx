// components/CreatePostModal.tsx
'use client'

import { useState } from 'react'

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostCreated: () => void
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('🔄 Creating post with:', { title, content })
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content
        }),
      })

      console.log('📨 API Response status:', response.status)
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('❌ API returned non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned an invalid response. Please try again.')
      }

      const data = await response.json()
      console.log('📦 API Response data:', data)

      if (response.ok) {
        console.log('✅ Post created successfully:', data.post)
        
        // Reset form and close modal
        setTitle('')
        setContent('')
        onPostCreated()
        onClose()
      } else {
        setError(data.error || 'Failed to create post')
      }
    } catch (error: any) {
      console.error('🚨 Error creating post:', error)
      setError(error.message || 'Failed to create post. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-brightness-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      {/* Modal content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Create Post</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Post Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
                placeholder="Enter post title"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Post Content *
              </label>
              <textarea
                id="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent resize-none"
                placeholder="What would you like to share with the community?"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{content.length}/1000 characters</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !title || !content}
                className="flex-1 px-4 py-2 bg-[#8B7355] text-white rounded-lg font-medium hover:bg-[#7A6347] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}