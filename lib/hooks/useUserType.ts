// lib/hooks/useUserType.ts
'use client'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export function useUserType() {
  const { user, isLoaded } = useUser()
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserType = async () => {
      if (isLoaded && user) {
        try {
          // Fetch user data from our database API
          const response = await fetch('/api/profile')
          if (response.ok) {
            const data = await response.json()
            
            if (data.user) {
              // Use the userType from our database
              const dbUserType = data.user.userType.toLowerCase() as 'customer' | 'business'
              setUserType(dbUserType)
              
              // Also update local storage for consistency
              localStorage.setItem('userType', dbUserType)
            } else {
              // Fallback to local storage if no user in database yet
              const storedType = localStorage.getItem('userType') as 'customer' | 'business' | null
              setUserType(storedType)
            }
          } else {
            // Fallback if API fails
            const storedType = localStorage.getItem('userType') as 'customer' | 'business' | null
            setUserType(storedType)
          }
        } catch (error) {
          console.error('Error fetching user type:', error)
          // Fallback to local storage
          const storedType = localStorage.getItem('userType') as 'customer' | 'business' | null
          setUserType(storedType)
        }
      } else if (isLoaded && !user) {
        // No user signed in
        setUserType(null)
      }
      setIsLoading(false)
    }

    fetchUserType()
  }, [user, isLoaded])

  return { userType, isLoading }
}