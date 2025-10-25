// components/ProtectedRoute.tsx
'use client'

import { useSessionCheck } from '../lib/hooks/useSessionCheck'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useSessionCheck()

  if (!isLoaded) {
    return (
      <div className="min-h-screen mediterranean-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen mediterranean-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to home...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}