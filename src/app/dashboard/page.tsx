'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SpotifyUser {
  display_name: string;
  email: string;
  images?: Array<{ url: string }>;
}

const moods = ['Happy', 'Sad', 'Chill', 'Energetic', 'Romantic'];

const moodToGenres: Record<string, string[]> = {
  Happy: ['pop', 'dance', 'happy'],
  Sad: ['acoustic', 'piano', 'emo'],
  Chill: ['lo-fi', 'chill', 'ambient'],
  Energetic: ['rock', 'edm', 'work-out'],
  Romantic: ['romance', 'rnb', 'soul'],
};

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch access token from cookie
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch('/api/token');
        const { access_token } = await res.json();

        if (!access_token) {
          setError('Access token missing');
        } else {
          setAccessToken(access_token);
        }
      } catch {
        setError('Failed to retrieve access token');
      }
    };

    getToken();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) return;

      try {
        const res = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        if (data.error) {
          setError(data.error.message);
        } else {
          setUser(data);
        }
      } catch {
        setError('Failed to fetch user');
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  const generatePlaylist = async (mood: string) => {
    if (!accessToken) return;
    
    const genres = moodToGenres[mood] || ['pop'];

    try {
      setLoading(true);

      // Get recommendations
      const recRes = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${genres.join(',')}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const recData = await recRes.json();
      const uris = recData.tracks.map((track: { uri: string }) => track.uri);

      // Get user ID
      const userRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();

      // Create playlist
      const playlistRes = await fetch(
        `https://api.spotify.com/v1/users/${userData.id}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${mood} Mood Playlist`,
            description: `Mood-based playlist for: ${mood} 🎧`,
            public: true,
          }),
        }
      );
      const playlistData = await playlistRes.json();

      // Add tracks to playlist
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris }),
        }
      );

      // Redirect
      router.push(`/playlist/${playlistData.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white bg-gradient-to-br from-black via-gray-900 to-zinc-800 min-h-screen">
      {error && <p className="text-red-500">Error: {error}</p>}
      {!accessToken && <p className="text-red-500">Missing access token</p>}

      {user ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Welcome, {user.display_name} 👋</h1>
            <p>Email: {user.email}</p>
            {user.images?.[0]?.url && (
              <Image 
                src={user.images[0].url} 
                alt="Profile" 
                width={96}
                height={96}
                className="rounded-full" 
              />
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => {
                  if (!loading) {
                    generatePlaylist(mood);
                  }
                }}
                disabled={loading}
                className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
                  loading
                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {mood}
              </button>
            ))}

            <button
              className="mt-6 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                window.location.href = '/api/auth/logout';
              }}
            >
              Logout
            </button>

            {loading && <p className="text-sm text-gray-300 w-full">Generating playlist...</p>}
          </div>
        </div>
      ) : (
        <p>Loading your Spotify profile...</p>
      )}
    </div>
  );
}
