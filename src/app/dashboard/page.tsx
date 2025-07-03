'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import MoodSelector from '../../../components/MoodSelector';

interface SpotifyUser {
  display_name: string;
  email: string;
  images?: Array<{ url: string }>;
}

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
    if (!accessToken) {
      alert('Please log in first');
      return;
    }

    try {
      setLoading(true);
      console.log('🎯 Sending request with mood:', mood);

      const res = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood: mood.toLowerCase() }),
      });

      const data = await res.json();
      console.log('📊 Response status:', res.status);
      console.log('📊 Response data:', data);

      if (!res.ok) {
        console.error('❌ Error response:', data);
        alert(`Failed to generate playlist: ${data.error || 'Unknown error'}`);
        return;
      }

      if (!data.playlistId) {
        console.error('❌ No playlist ID in response:', data);
        alert('Failed to generate playlist: No playlist ID returned');
        return;
      }

      console.log('✅ Playlist created successfully:', data.playlistId);
      // ✅ Redirect to playlist page
      router.push(`/playlist/${data.playlistId}`);
    } catch (err: unknown) {
      console.error('❌ Exception:', err);
      alert('Something went wrong while generating playlist: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200">Error: {error}</p>
          </div>
        )}

        {!accessToken && (
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
            <p className="text-yellow-200">Missing access token. Please log in again.</p>
          </div>
        )}

        {user ? (
          <div className="space-y-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                {user.images?.[0]?.url && (
                  <Image
                    src={user.images[0].url}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-white/20"
                  />
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome, {user.display_name}! 👋
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                How are you feeling today? Let&apos;s create the perfect playlist for your mood.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-center">Choose Your Mood</h2>
              <MoodSelector
                onSelect={generatePlaylist}
                loading={loading}
                disabled={!accessToken}
              />
              
              {loading && (
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce" />
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <p className="mt-2 text-gray-300">Creating your perfect playlist...</p>
                </div>
              )}
            </div>

            <div className="text-center pt-8">
              <button
                onClick={() => {
                  window.location.href = '/api/auth/logout';
                }}
                className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-300">Loading your Spotify profile...</p>
          </div>
        )}
      </div>
    </div>
  );
}
