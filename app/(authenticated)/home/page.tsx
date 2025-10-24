// app/(authenticated)/home/page.tsx
'use client'

import { useUserType } from '../../../lib/hooks/useUserType'

export default function HomePage() {
  const { userType, isLoading } = useUserType()

  if (isLoading) {
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
            ? 'Hello Business User!' 
            : 'Hello Community User!'}
        </h2>
        <p className="text-gray-600 text-lg text-center">
          {userType === 'business' 
            ? 'Welcome to your business dashboard. Manage your products and connect with customers.' 
            : 'Welcome to the community! Discover amazing local businesses and handmade products.'}
        </p>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {userType === 'business' ? 'Recent Activity' : 'Community Feed'}
        </h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            {userType === 'business' 
              ? 'Your business activity and analytics will appear here soon!'
              : 'Posts from local businesses will appear here soon!'}
          </p>
          <div className="mt-4 text-4xl">
            {userType === 'business' ? '📊' : '🌟'}
          </div>
        </div>
      </div>
    </div>
  )
}