import { NextRequest, NextResponse } from 'next/server';

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

  const redirectUrl = new URL('https://c5b5-49-36-183-242.ngrok-free.app');
  redirectUrl.pathname = '/dashboard';
  redirectUrl.searchParams.set('access_token', access_token);
  redirectUrl.searchParams.set('refresh_token', refresh_token);
  redirectUrl.searchParams.set('expires_in', expires_in.toString());

  return NextResponse.redirect(redirectUrl.toString());
}
