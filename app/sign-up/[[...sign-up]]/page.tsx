// app/sign-up/[[...sign-up]]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  
  const [userType, setUserType] = useState<'customer' | 'business'>('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationPending, setVerificationPending] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Countdown timer for verification code expiration
  useEffect(() => {
    if (!verificationPending || timeLeft <= 0) return

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
      if (timeLeft - 1 === 0) {
        setCanResend(true)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [verificationPending, timeLeft])

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

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Store user type in local storage
      localStorage.setItem('userType', userType)
      
      // If business user, also store business name
      if (userType === 'business' && businessName) {
        localStorage.setItem('businessName', businessName)
      }

      setVerificationPending(true)
      setTimeLeft(60)
      setCanResend(false)
      setError('')

    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Something went wrong')
      console.error('Error during sign up:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!isLoaded || !signUp || !canResend) return

    setIsLoading(true)
    setError('')

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setTimeLeft(60)
      setCanResend(false)
      setError('Verification code sent again!')
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if code has expired
    if (timeLeft <= 0) {
      setError('Verification code has expired. Please request a new one.')
      return
    }

    setIsLoading(true)
    setError('')

    if (!isLoaded || !signUp) {
      setError('Authentication not ready')
      setIsLoading(false)
      return
    }

    try {
      // Verify the email code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      })

      if (completeSignUp.status === 'complete') {
        // Set the user as active and create session
        await setActive({ session: completeSignUp.createdSessionId })
        
        // Redirect to home page
        router.push('/home')
      } else {
        setError('Verification failed. Please try again.')
        console.log('Verification status:', completeSignUp.status)
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid verification code')
      console.error('Error during verification:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // If verification is pending, show verification form
  if (verificationPending) {
    return (
      <div className="min-h-screen mediterranean-bg flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
              <p className="text-gray-600 mt-2">
                We sent a verification code to <strong>{email}</strong>
              </p>
              
              {/* Timer Display */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  {timeLeft > 0 ? (
                    <>Code expires in <strong>{timeLeft} seconds</strong></>
                  ) : (
                    <span className="text-red-600">Verification code has expired</span>
                  )}
                </p>
              </div>
            </div>

            <form onSubmit={handleVerification} className="space-y-6">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code *
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#228B22] focus:border-transparent"
                  placeholder="Enter the 6-digit code"
                  maxLength={6}
                />
              </div>

              {error && (
                <div className={`p-3 rounded-lg ${
                  error.includes('expired') || error.includes('Invalid') 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <p className={`text-sm ${
                    error.includes('expired') || error.includes('Invalid') 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || timeLeft <= 0}
                className="w-full bg-[#228B22] text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : timeLeft <= 0 ? 'Code Expired' : 'Verify Email'}
              </button>

              <div className="text-center space-y-3">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend || isLoading}
                  className="text-[#228B22] hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canResend ? 'Resend verification code' : `Resend available in ${timeLeft}s`}
                </button>
                
                <div className="border-t pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationPending(false)
                      setTimeLeft(60)
                      setCanResend(false)
                      setError('')
                    }}
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Back to sign up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Original sign-up form
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