import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get('access_token')?.value;

  if (!access_token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Get available genre seeds from Spotify
    const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch available genres');
    }

    const data = await response.json();
    
    // Our current genres
    const ourGenres = {
      happy: ['pop', 'dance', 'funk', 'disco'],
      sad: ['acoustic', 'piano', 'chill', 'indie'],
      energetic: ['rock', 'electronic', 'techno', 'edm'],
      chill: ['chill', 'ambient', 'jazz', 'classical'],
      romantic: ['soul', 'jazz', 'blues', 'acoustic'],
    };

    // Check which of our genres are valid
    const validation: Record<string, { valid: string[], invalid: string[] }> = {};
    for (const [mood, genres] of Object.entries(ourGenres)) {
      validation[mood] = {
        valid: genres.filter(g => data.genres.includes(g)),
        invalid: genres.filter(g => !data.genres.includes(g))
      };
    }

    return NextResponse.json({
      totalAvailableGenres: data.genres.length,
      ourGenresValidation: validation,
      allAvailableGenres: data.genres
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 });
  }
}
