// app/sign-up/[[...sign-up]]/page.tsx
'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const { isLoaded, signUp } = useSignUp()
  const router = useRouter()
  
  const [userType, setUserType] = useState<'customer' | 'business'>('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!isLoaded || !signUp) {
      setError('Authentication not ready')
      setIsLoading(false)
      return
    }

    try {
      // Start the sign-up process
      const result = await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      })

      if (result.status === 'complete') {
        // Prepare user metadata for your database
        const userMetadata = {
          userType,
          businessName: userType === 'business' ? businessName : undefined,
        }

        // You can store this in your database later
        console.log('User metadata:', userMetadata)
        
        // Redirect to appropriate page based on user type
        router.push('/home')
      } else {
        // Handle cases where more steps are needed (email verification, etc.)
        console.log('Sign up status:', result.status)
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong')
      console.error('Error during sign up:', err)
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
          <p className="text-xl text-gray-600">Join our community of local makers</p>
        </div>
      </div>

      {/* Right Side - Custom Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8 md:hidden">
              <h1 className="text-3xl font-bold text-gray-800">Local Artisans</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">I want to:</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('customer')}
                    className={`border-2 py-3 px-4 rounded-lg font-medium transition ${
                      userType === 'customer' 
                        ? 'bg-[#228B22] border-[#228B22] text-white' 
                        : 'border-[#228B22] text-[#228B22] hover:bg-[#228B22] hover:text-white'
                    }`}
                  >
                    Shop Local
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('business')}
                    className={`border-2 py-3 px-4 rounded-lg font-medium transition ${
                      userType === 'business' 
                        ? 'bg-[#8B7355] border-[#8B7355] text-white' 
                        : 'border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white'
                    }`}
                  >
                    Sell Products
                  </button>
                </div>
              </div>

              {/* Business Name Field (Conditional) */}
              {userType === 'business' && (
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                    placeholder="Enter your business name"
                  />
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
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
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                  placeholder="Create a secure password"
                  minLength={8}
                />
                <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters</p>
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/sign-in" className="text-[#228B22] hover:text-green-700 font-medium">
                  Sign in
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