// app/api/posts/[id]/comments/[commentId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '../../../../../../lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const resolvedParams = await params
    const postId = resolvedParams.id
    const commentId = resolvedParams.commentId
    
    console.log('🔄 PUT comment API called for:', { postId, commentId })
    
    if (!commentId) {
      console.log('❌ No comment ID provided')
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
    }
    
    const user = await currentUser()
    
    if (!user) {
      console.log('❌ No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      console.log('❌ Database user not found for Clerk ID:', user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { content } = await request.json()

    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }

    // Check if comment exists and belongs to user
    const existingComment = await (prisma as any).comment.findUnique({
      where: { id: commentId }
    })

    if (!existingComment) {
      console.log('❌ Comment not found:', commentId)
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    console.log('🔍 Found comment. Comment userId:', existingComment.userId, 'Current user ID:', dbUser.id)

    if (existingComment.userId !== dbUser.id) {
      console.log('❌ User does not own this comment')
      return NextResponse.json({ error: 'Not authorized to edit this comment' }, { status: 403 })
    }

    console.log('✏️ Proceeding with comment update...')
    const updatedComment = await (prisma as any).comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
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

    console.log('✅ Comment updated successfully')
    return NextResponse.json({ comment: updatedComment })
  } catch (error: any) {
    console.error('🚨 Error updating comment:', error)
    return NextResponse.json({ 
      error: 'Failed to update comment: ' + error.message 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const resolvedParams = await params
    const postId = resolvedParams.id
    const commentId = resolvedParams.commentId
    
    console.log('🔄 DELETE comment API called for:', { postId, commentId })
    
    if (!commentId) {
      console.log('❌ No comment ID provided')
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 })
    }
    
    const user = await currentUser()
    
    if (!user) {
      console.log('❌ No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    if (!dbUser) {
      console.log('❌ Database user not found for Clerk ID:', user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if comment exists and belongs to user
    const existingComment = await (prisma as any).comment.findUnique({
      where: { id: commentId }
    })

    if (!existingComment) {
      console.log('❌ Comment not found:', commentId)
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    console.log('🔍 Found comment. Comment userId:', existingComment.userId, 'Current user ID:', dbUser.id)

    if (existingComment.userId !== dbUser.id) {
      console.log('❌ User does not own this comment')
      return NextResponse.json({ error: 'Not authorized to delete this comment' }, { status: 403 })
    }

    console.log('🗑️ Proceeding with comment deletion...')
    await (prisma as any).comment.delete({
      where: { id: commentId }
    })

    console.log('✅ Comment deleted successfully')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('🚨 Error deleting comment:', error)
    return NextResponse.json({ 
      error: 'Failed to delete comment: ' + error.message 
    }, { status: 500 })
  }
}