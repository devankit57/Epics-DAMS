import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies() // Await the promise
  cookieStore.set('auth-token', '', { expires: new Date(0) }) // Set the cookie with an expired date to delete it.

  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL))
}
