// app/home/page.tsx
'use client'

import { UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null)

  useEffect(() => {
    // Get user type from local storage
    const storedUserType = localStorage.getItem('userType') as 'customer' | 'business' | null
    setUserType(storedUserType)
  }, [])

  return (
    <div className="min-h-screen mediterranean-bg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Local Artisans</h1>
            <p className="text-gray-600">Discover local makers in your community</p>
          </div>
          <UserButton />
        </header>

        {/* Simple Welcome Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {userType === 'business' 
              ? 'Hello Business User!' 
              : 'Hello Community User!'}
          </h2>
          <p className="text-gray-600 text-lg">
            {userType === 'business' 
              ? 'Welcome to your business dashboard.' 
              : 'Welcome to the community!'}
          </p>
        </div>
      </div>
    </div>
  )
}