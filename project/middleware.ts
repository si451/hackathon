import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Add paths that should be accessible without authentication
const publicPaths = ['/', '/login', '/register'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Get the current path
  const path = request.nextUrl.pathname

  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  )

  // Auth condition
  const isAuthPage = path.startsWith('/login') || path.startsWith('/register');
  
  // Protected routes that require authentication
  const isProtectedRoute = path.startsWith('/search') ||
                          path.startsWith('/dashboard') ||
                          path.startsWith('/profile') ||
                          path.startsWith('/campaigns') ||
                          path.startsWith('/messages');

  if (isAuthPage) {
    // If user is signed in and tries to access auth pages, redirect to search
    if (session) {
      return NextResponse.redirect(new URL('/search', request.url));
    }
    return response;
  }

  if (isProtectedRoute) {
    // If user is not signed in and tries to access protected route, redirect to login
    if (!session) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectedFrom', path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 