// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '../../../../lib/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params in Next.js 14+
    const resolvedParams = await params
    const postId = resolvedParams.id
    
    console.log('🔄 DELETE API called for post:', postId)
    
    if (!postId) {
      console.log('❌ No post ID provided')
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }
    
    const user = await currentUser()
    
    if (!user) {
      console.log('❌ No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Deleting post:', postId, 'for user:', user.id)

    // Find the current user in our database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      console.log('❌ Database user not found for Clerk ID:', user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('🔍 Found database user:', dbUser.id)

    // Find the post
    const post = await (prisma as any).post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      console.log('❌ Post not found:', postId)
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    console.log('🔍 Found post. Post userId:', post.userId, 'Current user ID:', dbUser.id)

    // Check if user owns the post
    if (post.userId !== dbUser.id) {
      console.log('❌ User does not own this post')
      return NextResponse.json({ error: 'Not authorized to delete this post' }, { status: 403 })
    }

    // Delete the post
    console.log('🗑️ Proceeding with post deletion...')
    await (prisma as any).post.delete({
      where: { id: postId }
    })

    console.log('✅ Post deleted successfully')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('🚨 Error deleting post:', error)
    return NextResponse.json({ 
      error: 'Failed to delete post: ' + error.message 
    }, { status: 500 })
  }
}