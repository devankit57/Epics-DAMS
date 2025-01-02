import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'
import type { RegisterCredentials } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body: RegisterCredentials = await request.json()
    const { name, email, password } = body

    const client = await clientPromise
    const db = client.db()

    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: 'User created successfully', userId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

