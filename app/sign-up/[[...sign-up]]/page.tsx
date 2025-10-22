import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen mediterranean-bg flex">
      {/* Left Side - Brand */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Local Artisans</h1>
          <p className="text-xl text-gray-600">Join our community of local makers</p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8 md:hidden">
              <h1 className="text-3xl font-bold text-gray-800">Local Artisans</h1>
            </div>
            <SignUp />
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