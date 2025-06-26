import { NextResponse } from 'next/server';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;
const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private'
];

export async function GET() {
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id',client_id);
    authUrl.searchParams.set('scope',scopes.join(' '));
     authUrl.searchParams.set('redirect_uri',redirect_uri);
     
     return NextResponse.redirect(authUrl.toString());
}