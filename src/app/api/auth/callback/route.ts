import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    }),
  });

  const data = await tokenResponse.json();

  if (data.error) {
    return NextResponse.json({ error: data.error_description || 'Token exchange failed' }, { status: 400 });
  }

  const { access_token, refresh_token, expires_in } = data;

  const cookieStore = await cookies();

  cookieStore.set('access_token', access_token, {
    httpOnly: true,
    path: '/',
    maxAge: expires_in,
    secure: process.env.NODE_ENV === 'production',
  });

  cookieStore.set('refresh_token', refresh_token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
  });

  // ✅ Redirect securely WITHOUT exposing token
  return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
}
