import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    res.cookies.delete(TOKEN_COOKIE_NAME);
    return res;
  }

  return NextResponse.json({ user: session });
}
