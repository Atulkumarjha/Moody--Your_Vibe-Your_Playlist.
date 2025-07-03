import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { moodToGenres } from '../../../../lib/moodToGenres';

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

const genreMap = moodToGenres;

export async function POST(req: NextRequest) {
  try {
    const body: CreatePlaylistRequest = await req.json();
    const moodRaw = body.mood;
    const mood = moodRaw?.toLowerCase();
    console.log('📩 Received mood:', mood);

    if (!mood || !(mood in genreMap)) {
      console.error('❌ Invalid mood:', mood, 'Available moods:', Object.keys(genreMap));
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
    
    if (!userRes.ok) {
      console.error('❌ User fetch failed with status:', userRes.status);
      const errorText = await userRes.text();
      console.error('Error response:', errorText);
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    const user: SpotifyUser = await userRes.json();
    console.log('👤 User fetch success:', user.id);
    
    if (!user.id) {
      console.error('❌ User ID missing:', user);
      return NextResponse.json({ error: 'User ID missing' }, { status: 500 });
    }

    // 2. Recommendations
    const seedGenres = genreMap[mood as keyof typeof genreMap];
    console.log('🎵 Using genres:', seedGenres);
    
    // Try with all genres first
    let recRes = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${seedGenres.join(',')}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    
    // If that fails, try with fewer genres
    if (!recRes.ok && seedGenres.length > 2) {
      console.log('⚠️ Trying with fewer genres...');
      recRes = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${seedGenres.slice(0, 2).join(',')}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
    }
    
    // If still failing, try with just one genre
    if (!recRes.ok) {
      console.log('⚠️ Trying with single genre...');
      recRes = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${seedGenres[0]}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
    }
    
    if (!recRes.ok) {
      console.error('❌ Recommendations fetch failed with status:', recRes.status);
      const errorText = await recRes.text();
      console.error('Error response:', errorText);
      return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
    }

    const recData: SpotifyRecommendationsResponse = await recRes.json();
    console.log('🎧 Recommendations success:', recData.tracks?.length, 'tracks');
    
    if (!recData.tracks || recData.tracks.length === 0) {
      console.error('❌ No tracks returned from recommendations');
      return NextResponse.json({ error: 'No tracks found for this mood' }, { status: 500 });
    }

    const trackURIs = recData.tracks.map((track: SpotifyTrack) => track.uri);
    console.log('🎼 Track URIs:', trackURIs.length);

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
    
    if (!playlistRes.ok) {
      console.error('❌ Playlist creation failed with status:', playlistRes.status);
      const errorText = await playlistRes.text();
      console.error('Error response:', errorText);
      return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
    }

    const playlistData: SpotifyPlaylist = await playlistRes.json();
    console.log('📚 Playlist creation success:', playlistData.id);
    
    if (!playlistData.id) {
      console.error('❌ Playlist ID missing:', playlistData);
      return NextResponse.json({ error: 'Playlist ID missing' }, { status: 500 });
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
    
    if (!addRes.ok) {
      console.error('❌ Add tracks failed with status:', addRes.status);
      const errorText = await addRes.text();
      console.error('Error response:', errorText);
      return NextResponse.json({ error: 'Failed to add tracks to playlist' }, { status: 500 });
    }

    const addData: SpotifyAddTracksResponse = await addRes.json();
    console.log('➕ Add tracks success:', addData.snapshot_id);

    console.log('✅ Playlist created successfully:', playlistData.id);
    return NextResponse.json({ playlistId: playlistData.id });

  } catch (error) {
    console.error('❌ Unexpected error in create-playlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
