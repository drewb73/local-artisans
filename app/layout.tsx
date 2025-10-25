// app/layout.tsx
import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Local Artisans',
  description: 'Discover local makers in your community',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#8B7355',
        },
        elements: {
          // Global Clerk styling to prevent weird pages
          card: 'shadow-lg border border-gray-200',
          headerTitle: 'text-gray-800',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
          formButtonPrimary: 'bg-[#8B7355] hover:bg-[#7A6347]',
          footerActionLink: 'text-[#8B7355] hover:text-[#7A6347]',
        }
      }}
    >
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}