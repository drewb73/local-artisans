// app/home/page.tsx
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen mediterranean-bg p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Local Artisans</h1>
            <p className="text-gray-600">Discover local makers in your community</p>
          </div>
          <UserButton />
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome Home!
          </h2>
          <p className="text-gray-600 mb-6">
            This is your personal home page. Here you'll be able to manage your profile, 
            view your activities, and explore local artisans.
          </p>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link 
              href="/profile" 
              className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Profile</h3>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </Link>
            
            <Link 
              href="/businesses" 
              className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Explore Artisans</h3>
              <p className="text-gray-600">Discover local businesses and makers</p>
            </Link>
            
            <Link 
              href="/products" 
              className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Browse Products</h3>
              <p className="text-gray-600">Find unique handmade products</p>
            </Link>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-600 text-center">
                Your recent activity will appear here soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}