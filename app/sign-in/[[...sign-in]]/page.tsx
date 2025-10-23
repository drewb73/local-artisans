// app/sign-in/[[...sign-in]]/page.tsx
'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!isLoaded || !signIn) {
      setError('Authentication not ready')
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/dashboard')
      } else {
        console.log('Sign in status:', result.status)
        setError('Sign in failed. Please try again.')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid email or password')
      console.error('Error during sign in:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen mediterranean-bg flex">
      {/* Left Side - Brand */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Local Artisans</h1>
          <p className="text-xl text-gray-600">Discover local makers in your community</p>
        </div>
      </div>

      {/* Right Side - Custom Sign In Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8 md:hidden">
              <h1 className="text-3xl font-bold text-gray-800">Local Artisans</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#228B22] text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/sign-up" className="text-[#228B22] hover:text-green-700 font-medium">
                  Sign up
                </a>
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="mediterranean-footer mt-8 rounded-lg p-4 text-center">
            <p className="text-white">
              © Local Artisans 2025 | <a href="#" className="underline">Contact Us</a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}