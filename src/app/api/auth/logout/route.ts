import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(TOKEN_COOKIE_NAME);
  return response;
}

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', req.url));
  response.cookies.delete(TOKEN_COOKIE_NAME);
  return response;
}
