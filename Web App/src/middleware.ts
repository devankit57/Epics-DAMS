import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('auth-token')?.value

  // Get the current path
  const { pathname } = request.nextUrl

  // Check if the request is for protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Check if user is already logged in and trying to access auth pages
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      try {
        const decoded = verifyToken(token)
        if (decoded) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch {
        // If token is invalid, continue to login/register page
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
}

