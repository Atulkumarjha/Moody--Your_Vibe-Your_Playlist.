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

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Fetch access token from cookie
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

  // ✅ Fetch Spotify user profile
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

  // ✅ Generate playlist via server API
  const generatePlaylist = async (mood: string) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood }),
      });

      const data = await res.json();
      console.log('🎵 Playlist API Response:', data);

      if (res.ok && data.playlistId) {
        router.push(`/playlist/${data.playlistId}`);
      } else {
        alert(`❌ Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('❌ Playlist generation failed:', err);
      alert('Something went wrong while generating your playlist.');
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
                  if (!loading) generatePlaylist(mood);
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
