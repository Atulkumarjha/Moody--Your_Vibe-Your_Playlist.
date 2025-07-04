import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { mood } = await req.json();
    console.log('🎯 Creating simple playlist for mood:', mood);

    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value;
    
    if (!access_token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user profile
    const userRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    
    if (!userRes.ok) {
      return NextResponse.json({ error: 'Failed to get user profile' }, { status: 500 });
    }
    
    const user = await userRes.json();

    // Simple search-based approach instead of recommendations
    const searchQueries = {
      happy: 'happy upbeat pop',
      sad: 'sad emotional acoustic',
      energetic: 'energy workout rock',
      chill: 'chill relaxing ambient',
      romantic: 'romantic love songs'
    };

    const query = searchQueries[mood.toLowerCase() as keyof typeof searchQueries] || 'popular music';
    
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!searchRes.ok) {
      return NextResponse.json({ error: 'Failed to search tracks' }, { status: 500 });
    }

    const searchData = await searchRes.json();
    const tracks = searchData.tracks.items;
    
    console.log('🔍 Search results:', {
      query,
      totalTracks: tracks?.length || 0,
      firstTrack: tracks?.[0]?.name || 'None'
    });

    if (!tracks || tracks.length === 0) {
      console.log('❌ No tracks found for query:', query);
      return NextResponse.json({ error: 'No tracks found' }, { status: 500 });
    }

    // Create playlist
    const playlistRes = await fetch(
      `https://api.spotify.com/v1/users/${user.id}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`,
          description: `Generated playlist for ${mood} mood`,
        }),
      }
    );

    if (!playlistRes.ok) {
      return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
    }

    const playlist = await playlistRes.json();

    // Add tracks
    const trackURIs = tracks.map((track: { uri: string }) => track.uri);
    
    console.log('🎵 Adding tracks to playlist:', {
      playlistId: playlist.id,
      trackCount: trackURIs.length,
      firstTrackURI: trackURIs[0] || 'None'
    });
    
    const addRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
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
      const errorData = await addRes.json();
      console.error('❌ Failed to add tracks:', errorData);
      return NextResponse.json({ error: 'Failed to add tracks' }, { status: 500 });
    }

    const addResult = await addRes.json();
    console.log('✅ Tracks added successfully:', addResult);

    console.log('✅ Simple playlist created:', playlist.id);
    return NextResponse.json({ playlistId: playlist.id });

  } catch (error) {
    console.error('❌ Error in simple playlist creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
