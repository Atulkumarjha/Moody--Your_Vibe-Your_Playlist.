import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;

export async function GET() {
    const cookieStore = await cookies();
    const refresh_token = cookieStore.get('refresh_token')?.value;

    if(!refresh_token) {
        return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
    }

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization:
            'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token,
        }),
    });

    const data = await tokenRes.json();

    if(data.error) {
        return NextResponse.json({ error: data.error_description || 'Refresh failed' }, { status: 400 });
    }

    cookieStore.set('access_token', data.access_token, {
        httpOnly: true,
        path: '/',
        maxAge: data.expires_in || 3000,
        secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json({ access_token: data.access_token });
}