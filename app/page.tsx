// app/page.tsx
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <SignedOut>
        {/* Show sign-in page for logged out users */}
        <div className="min-h-screen mediterranean-bg flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Local Artisans</h1>
            <p className="text-xl text-gray-600 mb-8">Discover local makers in your community</p>
            <div className="space-x-4">
              <a 
                href="/sign-in" 
                className="bg-[#228B22] text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Sign In
              </a>
              <a 
                href="/sign-up" 
                className="bg-[#8B7355] text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-800 transition"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Redirect to /home for signed in users */}
        <div className="min-h-screen mediterranean-bg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B7355] mx-auto"></div>
            <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
          </div>
        </div>
        {/* This will trigger a redirect to /home */}
        <script dangerouslySetInnerHTML={{
          __html: `window.location.href = '/home'`
        }} />
      </SignedIn>
    </>
  )
}