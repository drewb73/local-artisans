// app/api/posts/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '../../../../../lib/database'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const postId = resolvedParams.id
    
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if post exists
    const post = await (prisma as any).post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if already liked
    const existingLike = await (prisma as any).like.findUnique({
      where: {
        userId_postId: {
          userId: dbUser.id,
          postId: postId
        }
      }
    })

    if (existingLike) {
      // Unlike the post
      await (prisma as any).like.delete({
        where: {
          userId_postId: {
            userId: dbUser.id,
            postId: postId
          }
        }
      })
      
      return NextResponse.json({ liked: false })
    } else {
      // Like the post
      await (prisma as any).like.create({
        data: {
          userId: dbUser.id,
          postId: postId
        }
      })
      
      return NextResponse.json({ liked: true })
    }
  } catch (error: any) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ 
      error: 'Failed to toggle like: ' + error.message 
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const postId = resolvedParams.id
    
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has liked this post
    const existingLike = await (prisma as any).like.findUnique({
      where: {
        userId_postId: {
          userId: dbUser.id,
          postId: postId
        }
      }
    })

    // Get like count
    const likeCount = await (prisma as any).like.count({
      where: { postId: postId }
    })

    return NextResponse.json({ 
      liked: !!existingLike,
      likeCount 
    })
  } catch (error: any) {
    console.error('Error fetching like status:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch like status: ' + error.message 
    }, { status: 500 })
  }
}