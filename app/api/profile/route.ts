// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '../../../lib/database'

export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user in our database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { profile: true }
    })

    return NextResponse.json({ 
      user: dbUser,
      profile: dbUser?.profile || null 
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { firstName, lastName, businessName, bio } = await request.json()

    // Create or update user and profile
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        userType: businessName ? 'BUSINESS' : 'CUSTOMER',
        profile: {
          upsert: {
            create: {
              firstName,
              lastName,
              businessName,
              bio: bio || ''
            },
            update: {
              firstName,
              lastName, 
              businessName,
              bio: bio || ''
            }
          }
        }
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        userType: businessName ? 'BUSINESS' : 'CUSTOMER',
        profile: {
          create: {
            firstName,
            lastName,
            businessName,
            bio: bio || ''
          }
        }
      },
      include: {
        profile: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      profile: dbUser.profile 
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}