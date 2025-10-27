// app/(authenticated)/layout.tsx
'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUserType } from '../../lib/hooks/useUserType'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useState, useEffect } from 'react'
import CreatePostModal from '../../components/CreatePostModal'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { userType, isLoading } = useUserType()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

  // Fetch user profile data
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

  // Handle post creation - refresh the page to show new posts
  const handlePostCreated = () => {
    console.log('Post created - refreshing page...')
    // Simple and reliable: reload the page to show the new post
    window.location.reload()
  }

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen mediterranean-bg flex">
        <div className="w-64 bg-[#FFFBF0] border-r border-gray-200 animate-pulse">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        </div>
      </div>
    )
  }

  // Navigation items
  const communityNavItems = [
    { name: 'Home', href: '/home', icon: '🏠' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Discover', href: '/discover', icon: '🔍' },
    { name: 'Favorites', href: '/favorites', icon: '❤️' },
  ]

  const businessNavItems = [
    { name: 'Home', href: '/home', icon: '🏠' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Analytics Dashboard', href: '/analytics', icon: '📊' },
    { name: 'Discover', href: '/discover', icon: '🔍' },
    { name: 'Favorites', href: '/favorites', icon: '❤️' },
  ]

  const currentNavItems = userType === 'business' ? businessNavItems : communityNavItems
  const displayName = userType === 'business' 
    ? userProfile?.businessName || 'Your Business' 
    : `${userProfile?.firstName || 'User'} ${userProfile?.lastName || 'Name'}`

  return (
    <ProtectedRoute>
      <div className="min-h-screen mediterranean-bg flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#FFFBF0] border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Local Artisans</h1>
            <p className="text-sm text-gray-600 mt-1">Discover local makers</p>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {userType === 'business' ? 'Business Account' : 'Community Member'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {currentNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                        isActive
                          ? 'bg-[#8B7355] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Create Post Button for Business Users */}
          {userType === 'business' && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#8B7355] text-white rounded-lg font-medium hover:bg-[#7A6347] transition"
              >
                <span className="text-lg">📝</span>
                <span>Create Post</span>
              </button>
            </div>
          )}

          {/* Settings */}
          <div className="p-4 border-t border-gray-200">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/settings"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                    pathname === '/settings'
                      ? 'bg-[#8B7355] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">⚙️</span>
                  <span className="font-medium">Settings</span>
                </Link>
              </li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                © 2025 Local Artisans
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="bg-[#B89B6A] border-b border-[#A68C5F] px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-white">
                {userType === 'business' 
                  ? `${userProfile?.businessName || 'Business'} Dashboard` 
                  : 'Community Hub'}
              </h1>
              
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-white hover:text-gray-100 hover:bg-[#A68C5F] rounded-lg transition">
                  <span className="text-xl">🔔</span>
                </button>

                <button className="relative p-2 text-white hover:text-gray-100 hover:bg-[#A68C5F] rounded-lg transition">
                  <span className="text-xl">✉️</span>
                </button>

                <UserButton
                  appearance={{
                    elements: {
                      rootBox: "flex",
                      userButtonTrigger: "flex select-none items-center justify-center rounded-lg bg-[#8B7355] hover:bg-[#7A6347] transition",
                      userButtonBox: "flex",
                      userButtonOuterIdentifier: "text-sm text-white",
                      card: "bg-[#FFFBF0] border border-[#8B7355] shadow-lg rounded-lg",
                      header: "hidden",
                      headerTitle: "text-gray-800",
                      headerSubtitle: "text-gray-600",
                      menuButton: "text-gray-700 hover:bg-[#8B7355] hover:text-white rounded-lg transition",
                      menuList: "space-y-1 p-2",
                      footer: "hidden",
                      userPreview: "border-b border-gray-200 pb-3 mb-2",
                      userPreviewMainIdentifier: "text-gray-800 font-medium",
                      userPreviewSecondaryIdentifier: "text-gray-600 text-sm",
                      active: "bg-[#8B7355] text-white",
                      danger: "text-red-600 hover:bg-red-50 hover:text-red-700",
                      avatarBox: "w-8 h-8",
                    },
                    variables: {
                      colorPrimary: "#8B7355",
                      colorText: "#374151",
                      colorTextSecondary: "#6B7280",
                      colorBackground: "#FFFBF0",
                      colorInputBackground: "#FFFFFF",
                      colorInputText: "#1F2937",
                    }
                  }}
                />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      </div>
    </ProtectedRoute>
  )
}