// components/CommentModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  user: {
    id: string
    profile: {
      firstName: string
      lastName: string
      businessName: string | null
      avatarUrl: string | null
    }
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  userId: string
  user: {
    id: string
    clerkId: string
    profile: {
      firstName: string
      lastName: string
      businessName: string | null
      avatarUrl: string | null
    }
  }
}

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  postTitle: string
  onCommentsChanged?: () => void // Add callback for when comments change
}

export default function CommentModal({ isOpen, onClose, postId, postTitle, onCommentsChanged }: CommentModalProps) {
  const { user } = useUser()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [editContent, setEditContent] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Fetch current user's database ID and post/comments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCurrentUser()
      fetchPostAndComments()
    }
  }, [isOpen, postId])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setCurrentUserId(data.user?.id || null)
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  const fetchPostAndComments = async () => {
    setIsLoading(true)
    try {
      // Fetch the specific post
      const postResponse = await fetch('/api/posts')
      if (postResponse.ok) {
        const postsData = await postResponse.json()
        const currentPost = postsData.posts.find((p: Post) => p.id === postId)
        setPost(currentPost || null)
      }

      // Fetch comments
      const commentsResponse = await fetch(`/api/posts/${postId}/comments`)
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        setComments(commentsData.comments || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load post and comments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => [data.comment, ...prev])
        setComment('')
        // Trigger refresh callback
        onCommentsChanged?.()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to post comment')
      }
    } catch (error: any) {
      console.error('Error posting comment:', error)
      setError('Failed to post comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment)
    setEditContent(comment.content)
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent('')
  }

  const handleSaveEdit = async () => {
    if (!editingComment || !editContent.trim()) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: editingComment.id,
          content: editContent.trim()
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => prev.map(c => 
          c.id === editingComment.id ? data.comment : c
        ))
        setEditingComment(null)
        setEditContent('')
        // Trigger refresh callback
        onCommentsChanged?.()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update comment')
      }
    } catch (error: any) {
      console.error('Error updating comment:', error)
      setError('Failed to update comment. Please try again.')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId: commentId
        }),
      })

      if (response.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId))
        // Trigger refresh callback
        onCommentsChanged?.()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete comment')
      }
    } catch (error: any) {
      console.error('Error deleting comment:', error)
      setError('Failed to delete comment. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDisplayName = (profile: any) => {
    return profile.businessName || `${profile.firstName} ${profile.lastName}`
  }

  const isUserComment = (comment: Comment) => {
    return currentUserId === comment.userId
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Comments</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Post Content */}
          {post && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  {post.user.profile.avatarUrl ? (
                    <img 
                      src={post.user.profile.avatarUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {getDisplayName(post.user.profile)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{post.content}</p>
            </div>
          )}
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B7355]"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 mb-4">
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </h3>
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                  {editingComment?.id === comment.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent resize-none"
                        maxLength={500}
                      />
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={!editContent.trim()}
                          className="px-3 py-1 text-sm bg-[#8B7355] text-white rounded-lg hover:bg-[#7A6347] transition disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        {comment.user.profile.avatarUrl ? (
                          <img 
                            src={comment.user.profile.avatarUrl} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-800 text-sm">
                              {getDisplayName(comment.user.profile)}
                            </p>
                            <span className="text-gray-400">•</span>
                            <p className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </p>
                            {comment.updatedAt !== comment.createdAt && (
                              <>
                                <span className="text-gray-400">•</span>
                                <p className="text-xs text-gray-500 italic">
                                  edited {formatDate(comment.updatedAt)}
                                </p>
                              </>
                            )}
                          </div>
                          
                          {/* Edit/Delete Buttons - Show only for comment owner */}
                          {isUserComment(comment) && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                title="Edit comment"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                title="Delete comment"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 mt-1 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                      </div>
                    )}
                  </div>
          
                  {/* Comment input */}
                  <div className="p-6 border-t border-gray-200">
                    {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
                    {user ? (
                      <form onSubmit={handleSubmitComment} className="space-y-3">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent resize-none"
                          placeholder={`Add a comment to "${postTitle || (post?.title ?? '')}"`}
                          maxLength={500}
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            disabled={!comment.trim() || isSubmitting}
                            className="px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#7A6347] transition disabled:opacity-50"
                          >
                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-sm text-gray-600">
                        <p>Please sign in to post a comment.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          }