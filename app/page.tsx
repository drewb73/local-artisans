import { SignedIn, SignedOut, UserButton, SignOutButton } from '@clerk/nextjs'

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
        {/* Show welcome dashboard for logged in users */}
        <div className="min-h-screen mediterranean-bg flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome!</h1>
            <p className="text-xl text-gray-600 mb-8">You're successfully signed in to Local Artisans</p>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-4">
                <UserButton />
                <span className="text-gray-600">Profile</span>
              </div>
              <SignOutButton redirectUrl="/">
                <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  )
}