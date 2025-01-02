import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'
import { verifyPassword, generateToken } from '@/lib/auth'
import type { LoginCredentials } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body: LoginCredentials = await request.json()
    const { email, password } = body

    const client = await clientPromise
    const db = client.db()

    // Find user
    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user._id.toString())

    // Create the response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

    // Set cookie with proper configuration
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

