// lib/hooks/useUserType.ts (simplified version)
'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export function useUserType() {
  const { user, isLoaded } = useUser()
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(false)
      return
    }

    if (!user) {
      setUserType(null)
      setIsLoading(false)
      return
    }

    // Always fetch fresh data from API
    const fetchUserType = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.user?.userType) {
            const dbUserType = data.user.userType.toLowerCase() as 'customer' | 'business'
            setUserType(dbUserType)
          }
        }
      } catch (error) {
        console.error('Error fetching user type:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserType()
  }, [user, isLoaded])

  return { userType, isLoading }
}