import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token')?.value;

  if (!access_token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { playlistId, name, description } = await req.json();

    // This endpoint is mainly for logging/tracking purposes
    // The playlist is already created in the user's Spotify account
    // We could extend this to save to a database if needed

    console.log('Playlist saved:', {
      playlistId,
      name,
      description,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true, message: 'Playlist saved successfully' });
  } catch (error) {
    console.error('Error saving playlist:', error);
    return NextResponse.json({ error: 'Failed to save playlist' }, { status: 500 });
  }
}