// app/(authenticated)/home/page.tsx
'use client'

import { useUserType } from '../../../lib/hooks/useUserType'
import { useState, useEffect } from 'react'
import PostCard from '../../../components/PostCard'

interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  user: {
    profile: {
      firstName: string
      lastName: string
      businessName: string | null
      avatarUrl: string | null
    }
  }
}

export default function HomePage() {
  const { userType, isLoading } = useUserType()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)

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
  useEffect(() => {
    const fetchPosts = async () => {
      try {
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

    fetchPosts()
  }, [])

  if (isLoading || profileLoading) {
    return (
      <div className="max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
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
      {/* Welcome Message */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          {userType === 'business' 
            ? `Hello ${userProfile?.businessName || 'Business'}!` 
            : `Hello ${userProfile?.firstName || 'Community User'}!`}
        </h2>
        <p className="text-gray-600 text-lg text-center">
          {userType === 'business' 
            ? 'Welcome to your business dashboard. Manage your products and connect with customers.' 
            : 'Welcome to the community! Discover amazing local businesses and handmade products.'}
        </p>
        
        {/* Show user info if available */}
        {userProfile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Signed in as: {userProfile.firstName} {userProfile.lastName}
              {userProfile.businessName && ` • ${userProfile.businessName}`}
            </p>
          </div>
        )}
      </div>

      {/* Posts Feed */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {userType === 'business' ? 'Your Community Feed' : 'Community Feed'}
        </h3>
        
        {postsLoading ? (
          // Loading state for posts
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
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
          // Posts list
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="bg-gray-50 rounded-lg p-8 text-center">
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