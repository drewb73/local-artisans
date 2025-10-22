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
            
            {/* Custom user type selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">I want to:</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="border-2 border-[#228B22] text-[#228B22] py-2 px-4 rounded-lg font-medium hover:bg-[#228B22] hover:text-white transition"
                >
                  Shop Local
                </button>
                <button
                  type="button"
                  className="border-2 border-[#8B7355] text-[#8B7355] py-2 px-4 rounded-lg font-medium hover:bg-[#8B7355] hover:text-white transition"
                >
                  Sell Products
                </button>
              </div>
            </div>

            <SignUp 
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/"  // Changed to redirect to sign-in after sign-up
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-[#228B22] hover:bg-green-700',
                  footerActionLink: 'text-[#228B22] hover:text-green-700',
                }
              }}
            />
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