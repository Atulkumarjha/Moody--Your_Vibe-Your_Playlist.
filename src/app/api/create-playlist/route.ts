import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface SpotifyTrack {
  uri: string;
  id: string;
  name: string;
  artists: Array<{ name: string }>;
}

interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
}

interface CreatePlaylistRequest {
  mood: string;
}

interface SpotifyUser {
  id: string;
  display_name: string;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
}

interface SpotifyAddTracksResponse {
  snapshot_id: string;
}

const genreMap: Record<string, string[]> = {
  happy: ['pop', 'dance', 'edm'],
  sad: ['acoustic', 'piano', 'chill'],
  energetic: ['work-out', 'rock', 'techno'],
  chill: ['lo-fi', 'ambient', 'chill'],
  romantic: ['romance', 'rnb', 'soul'],
};

export async function POST(req: NextRequest) {
  const body: CreatePlaylistRequest = await req.json();
  const moodRaw = body.mood;
  const mood = moodRaw?.toLowerCase();
  console.log('📩 Received mood:', mood);

  if (!mood || !genreMap[mood]) {
    console.error('❌ Invalid mood:', mood);
    return NextResponse.json({ error: 'Invalid mood: ' + mood }, { status: 400 });
  }

  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token')?.value;
  if (!access_token) {
    console.error('❌ Missing access token');
    return NextResponse.json({ error: 'Access token missing' }, { status: 401 });
  }

  // 1. User profile
  const userRes = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const user: SpotifyUser = await userRes.json();
  console.log('👤 User fetch status:', userRes.status, user.id);
  if (userRes.status !== 200 || !user.id) {
    console.error('❌ User fetch failed:', user);
    return NextResponse.json({ error: 'User fetch failed: ' + JSON.stringify(user) }, { status: 500 });
  }

  // 2. Recommendations
  const seedGenres = genreMap[mood];
  const recRes = await fetch(
    `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${seedGenres.join(',')}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const recData: SpotifyRecommendationsResponse = await recRes.json();
  console.log('🎧 Recommendations status:', recRes.status, recData.tracks?.length);
  if (recRes.status !== 200 || !recData.tracks) {
    console.error('❌ Recommendations fetch failed:', recData);
    return NextResponse.json({ error: 'Recommendations failed: ' + JSON.stringify(recData) }, { status: 500 });
  }

  const trackURIs = recData.tracks?.map((track: SpotifyTrack) => track.uri) || [];
  if (trackURIs.length === 0) {
    console.error('❌ No tracks returned');
    return NextResponse.json({ error: 'No tracks returned' }, { status: 500 });
  }

  // 3. Create playlist
  const playlistRes = await fetch(
    `https://api.spotify.com/v1/users/${user.id}/playlists`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes Playlist`,
        description: `Generated for mood: ${mood}`,
      }),
    }
  );
  const playlistData: SpotifyPlaylist = await playlistRes.json();
  console.log('📚 Playlist creation status:', playlistRes.status, playlistData);
  if (playlistRes.status !== 201 || !playlistData.id) {
    console.error('❌ Playlist creation failed', playlistData);
    return NextResponse.json({ error: 'Playlist creation failed: ' + JSON.stringify(playlistData) }, { status: 500 });
  }

  // 4. Add tracks
  const addRes = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: trackURIs }),
    }
  );
  const addData: SpotifyAddTracksResponse = await addRes.json();
  console.log('➕ Add tracks status:', addRes.status, addData);
  if (addRes.status !== 201 && addRes.status !== 200) {
    console.error('❌ Failed to add tracks', addData);
    return NextResponse.json({ error: 'Add tracks failed: ' + JSON.stringify(addData) }, { status: 500 });
  }

  return NextResponse.json({ playlistId: playlistData.id });
}
