// lib/hooks/useSessionCheck.ts
'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useSessionCheck() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // If Clerk says user is not signed in, redirect to home
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  return { isLoaded, isSignedIn }
}