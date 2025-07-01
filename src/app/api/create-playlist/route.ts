// src/app/api/create-playlist/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mood → genre seed map (Spotify-approved genres)
const genreMap: Record<string, string[]> = {
  happy: ['pop', 'dance', 'edm'],
  sad: ['acoustic', 'piano', 'chill'],
  energetic: ['work-out', 'rock', 'techno'],
  calm: ['ambient', 'classical', 'chill'],
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const mood = body.mood;

  if (!mood || !genreMap[mood]) {
    return NextResponse.json({ error: 'Invalid mood' }, { status: 400 });
  }

  const cookieStore = cookies();
  const access_token = cookieStore.get('access_token')?.value;

  if (!access_token) {
    return NextResponse.json({ error: 'Access token missing' }, { status: 401 });
  }

  // 1. Get current user's Spotify ID
  const userRes = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const user = await userRes.json();

  if (!user.id) {
    return NextResponse.json({ error: 'Failed to get user ID' }, { status: 500 });
  }

  // 2. Get track recommendations
  const seedGenres = genreMap[mood];
  const recRes = await fetch(
    `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${seedGenres.join(',')}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const recData = await recRes.json();

  const trackURIs = recData.tracks?.map((track: any) => track.uri) || [];

  if (trackURIs.length === 0) {
    return NextResponse.json({ error: 'No tracks found' }, { status: 500 });
  }

  // 3. Create a playlist
  const playlistRes = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `${mood} vibes playlist`,
      description: `A mood-based playlist for ${mood}`,
      public: false,
    }),
  });

  const playlist = await playlistRes.json();

  if (!playlist.id) {
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }

  // 4. Add tracks to the playlist
  await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: trackURIs,
    }),
  });

  return NextResponse.json({ playlistId: playlist.id });
}
