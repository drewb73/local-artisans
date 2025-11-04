// components/PostCard.tsx
'use client'

import { useState, useEffect } from 'react'
import { useUserType } from '../lib/hooks/useUserType'
import CommentModal from './CommentModal'

interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  userId: string
  user: {
    id: string
    profile: {
      firstName: string
      lastName: string
      businessName: string | null
      avatarUrl: string | null
    }
  }
  _count?: {
    likes: number
    comments: number
  }
}

interface PostCardProps {
  post: Post
  onEdit?: (post: Post) => void
  onDelete?: (postId: string) => void
  onRefreshPosts?: () => void // Add refresh function prop
}

export default function PostCard({ post, onEdit, onDelete, onRefreshPosts }: PostCardProps) {
  const { userType } = useUserType()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  // Fetch like status when component mounts
  useEffect(() => {
    fetchLikeStatus()
  }, [post.id])

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`)
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setLikeCount(data.likeCount)
      }
    } catch (error) {
      console.error('Error fetching like status:', error)
    }
  }

  // Format date as MM/DD/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const displayName = post.user.profile.businessName 
    ? post.user.profile.businessName 
    : `${post.user.profile.firstName} ${post.user.profile.lastName}`

  const canEditDelete = userType === 'business'

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    setIsDeleting(true)
    setError('')
    
    try {
      console.log('🔄 Attempting to delete post:', post.id)
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      })

      console.log('📨 Delete response status:', response.status)
      console.log('📨 Delete response ok:', response.ok)
      
      const responseText = await response.text()
      console.log('📨 Raw response:', responseText)
      
      let errorData: { error?: string } = {}
      try {
        errorData = responseText ? (JSON.parse(responseText) as { error?: string }) : {}
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText)
      }

      if (response.ok) {
        console.log('✅ Post deleted successfully')
        onDelete?.(post.id)
      } else {
        console.error('❌ Delete failed. Status:', response.status, 'Data:', errorData)
        setError(errorData.error || `Failed to delete post (Status: ${response.status})`)
      }
    } catch (error: any) {
      console.error('🚨 Network error deleting post:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsDeleting(false)
      setIsDropdownOpen(false)
    }
  }

  const handleEdit = () => {
    onEdit?.(post)
    setIsDropdownOpen(false)
  }

  const handleLike = async () => {
    if (isLiking) return
    
    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to like post')
      }
    } catch (error: any) {
      console.error('Error toggling like:', error)
      setError('Failed to like post. Please try again.')
    } finally {
      setIsLiking(false)
    }
  }

  const handleCommentClick = () => {
    setIsCommentModalOpen(true)
  }

  // Refresh posts when comments change
  const handleCommentsChanged = () => {
    console.log('🔄 Comments changed - refreshing posts...')
    onRefreshPosts?.() // Refresh the posts list to update comment counts
    fetchLikeStatus() // Refresh like status as well
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm relative">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={() => setError('')}
            className="mt-2 text-xs text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {post.user.profile.avatarUrl ? (
              <img 
                src={post.user.profile.avatarUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </div>
          
          {/* Name and Date */}
          <div>
            <p className="font-semibold text-gray-800">{displayName}</p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Edit/Delete Dropdown - Only show for business users */}
        {canEditDelete && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-3">{post.title}</h3>

      {/* Post Content */}
      <div className="text-gray-600 whitespace-pre-wrap mb-4">
        {post.content}
      </div>

      {/* Like and Comment Buttons */}
      <div className="flex items-center space-x-6 pt-4 border-t border-gray-100">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center space-x-2 transition-colors ${
            isLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-500 hover:text-gray-700'
          } disabled:opacity-50`}
        >
          <svg 
            className="w-5 h-5" 
            fill={isLiked ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
          <span className="text-sm font-medium">
            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={handleCommentClick}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          <span className="text-sm font-medium">
            {post._count?.comments || 0} {post._count?.comments === 1 ? 'Comment' : 'Comments'}
          </span>
        </button>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postId={post.id}
        postTitle={post.title}
        onCommentsChanged={handleCommentsChanged}
      />

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  )
}