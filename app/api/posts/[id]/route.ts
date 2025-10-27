// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '../../../../lib/database'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      console.log('❌ Database user not found for Clerk ID:', user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('🔍 Found database user:', dbUser.id)

    const post = await (prisma as any).post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      console.log('❌ Post not found:', postId)
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    console.log('🔍 Found post. Post userId:', post.userId, 'Current user ID:', dbUser.id)

    if (post.userId !== dbUser.id) {
      console.log('❌ User does not own this post')
      return NextResponse.json({ error: 'Not authorized to delete this post' }, { status: 403 })
    }

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const postId = resolvedParams.id
    
    console.log('🔄 PUT API called for post:', postId)
    
    if (!postId) {
      console.log('❌ No post ID provided')
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }
    
    const user = await currentUser()
    
    if (!user) {
      console.log('❌ No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    console.log('🔄 Updating post:', postId, 'for user:', user.id)

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      console.log('❌ Database user not found for Clerk ID:', user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('🔍 Found database user:', dbUser.id)

    const post = await (prisma as any).post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      console.log('❌ Post not found:', postId)
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    console.log('🔍 Found post. Post userId:', post.userId, 'Current user ID:', dbUser.id)

    if (post.userId !== dbUser.id) {
      console.log('❌ User does not own this post')
      return NextResponse.json({ error: 'Not authorized to edit this post' }, { status: 403 })
    }

    console.log('✏️ Proceeding with post update...')
    const updatedPost = await (prisma as any).post.update({
      where: { id: postId },
      data: {
        title,
        content,
        updatedAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    console.log('✅ Post updated successfully')
    return NextResponse.json({ post: updatedPost })
  } catch (error: any) {
    console.error('🚨 Error updating post:', error)
    return NextResponse.json({ 
      error: 'Failed to update post: ' + error.message 
    }, { status: 500 })
  }
}