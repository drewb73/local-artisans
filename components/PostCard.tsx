// components/PostCard.tsx
'use client'

interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  user: {
    profile: {
      firstName: string
      lastName: string
      businessName: string | null
      avatarUrl: string | null
    }
  }
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  // Format date as MM/DD/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const displayName = post.user.profile.businessName 
    ? post.user.profile.businessName 
    : `${post.user.profile.firstName} ${post.user.profile.lastName}`

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {post.user.profile.avatarUrl ? (
              <img 
                src={post.user.profile.avatarUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </div>
          
          {/* Name and Date */}
          <div>
            <p className="font-semibold text-gray-800">{displayName}</p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Post Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-3">{post.title}</h3>

      {/* Post Content */}
      <div className="text-gray-600 whitespace-pre-wrap">
        {post.content}
      </div>
    </div>
  )
}