import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock user session data - this would normally be retrieved from a JWT/cookie
// In a real app, you would verify the session token with your auth provider
const getUserRoleFromSession = (request: NextRequest) => {
  // Uppdaterad för att bara innehålla admin-session
  const mockSessions: Record<string, string> = {
    'admin-session-id': 'admin',
  };
  
  // Get session token from cookie
  const sessionToken = request.cookies.get('session-token')?.value;
  
  // Return the role if session exists, otherwise return 'guest'
  return sessionToken && mockSessions[sessionToken] ? mockSessions[sessionToken] : 'guest';
};

// Role-based access map
const roleAccess: Record<string, string[]> = {
  admin: ['/admin', '/admin/users', '/admin/profiles', '/admin/messages', '/admin/statistics'],
  staff: ['/admin/profiles', '/admin/messages'],
  user: [],
  guest: []
};

export async function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const path = request.nextUrl.pathname;
  
  // Only apply middleware to admin routes
  if (path.startsWith('/admin')) {
    // Get user role
    const role = getUserRoleFromSession(request);
    
    // Check if user has access to the path
    const hasAccess = roleAccess[role]?.some(route => 
      path === route || path.startsWith(`${route}/`)
    );
    
    // If no access, redirect to login page
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  // Match only the admin routes
  matcher: ['/admin/:path*']
}; 