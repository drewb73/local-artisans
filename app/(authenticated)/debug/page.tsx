// app/(authenticated)/debug/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export default function DebugPage() {
  const { user } = useUser()
  const [apiData, setApiData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()
        setApiData(data)
      } catch (error) {
        console.error('Debug fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading debug data...</div>

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Clerk User:</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify({
                id: user?.id,
                email: user?.emailAddresses?.[0]?.emailAddress,
                firstName: user?.firstName,
                lastName: user?.lastName
              }, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="font-semibold">API Profile Response:</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="font-semibold">Local Storage:</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify({
                userType: localStorage.getItem('userType'),
                businessName: localStorage.getItem('businessName')
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}