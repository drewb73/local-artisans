// lib/hooks/useUserType.ts
'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export function useUserType() {
  const { user, isLoaded } = useUser()
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      // Get user type from Clerk public metadata (if available)
      const metadata = user.publicMetadata
      const type = metadata.userType as 'customer' | 'business'
      
      if (type) {
        setUserType(type)
        // Also update local storage for consistency
        localStorage.setItem('userType', type)
      } else {
        // Fallback to local storage if metadata not set
        const storedType = localStorage.getItem('userType') as 'customer' | 'business' | null
        setUserType(storedType)
      }
      setIsLoading(false)
    } else if (isLoaded && !user) {
      // No user signed in
      setIsLoading(false)
    }
  }, [user, isLoaded])

  return { userType, isLoading }
}