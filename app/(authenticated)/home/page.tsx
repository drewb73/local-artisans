// app/(authenticated)/home/page.tsx
'use client'

import { useUserType } from '../../../lib/hooks/useUserType'
import { useState, useEffect } from 'react'
import PostCard from '../../../components/PostCard'
import EditPostModal from '../../../components/EditPostModal'

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

export default function HomePage() {
  const { userType, isLoading } = useUserType()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data.profile)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    if (!isLoading) {
      fetchProfile()
    }
  }, [isLoading])

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setPostsLoading(true)
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setPostsLoading(false)
    }
  }

  // Initial posts fetch
  useEffect(() => {
    fetchPosts()
  }, [])

  // Refresh posts function - can be called from child components
  const refreshPosts = async () => {
    console.log('🔄 Refreshing posts...')
    await fetchPosts()
  }

  // Handle post deletion
  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  // Handle post edit
  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setIsEditModalOpen(true)
  }

  // Handle post update
  const handlePostUpdated = () => {
    console.log('Post updated - refreshing posts...')
    refreshPosts()
  }

  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingPost(null)
  }

  // Expose refresh function to window for layout to access
  useEffect(() => {
    // @ts-ignore
    window.refreshHomePagePosts = refreshPosts
  }, [])

  if (isLoading || profileLoading) {
    return (
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onPostUpdated={handlePostUpdated}
        post={editingPost}
      />

      {/* Posts Feed - No container, just posts on the pale yellow background */}
      <div>
        {postsLoading ? (
          // Loading state for posts
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          // Posts list - no container, just posts
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post}
                onDelete={handleDeletePost}
                onEdit={handleEditPost}
                onRefreshPosts={refreshPosts}
              />
            ))}
          </div>
        ) : (
          // Empty state - simplified
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <p className="text-gray-600 mb-4">
              {userType === 'business' 
                ? 'No posts yet. Be the first to share something with the community!'
                : 'No posts yet. Check back soon for updates from local businesses!'}
            </p>
            <div className="text-4xl">
              {userType === 'business' ? '📝' : '🌟'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}