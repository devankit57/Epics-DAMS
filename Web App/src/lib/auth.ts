import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function hashPassword(password: string) {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}

export function generateToken(userId: string) {
  return sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export function getTokenFromCookies() {
  const cookieStore = cookies()
  return cookieStore.get('auth-token')?.value
}

export async function getCurrentUserId(): Promise<string | null> {
  const token = getTokenFromCookies()
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  return decoded.userId
}

