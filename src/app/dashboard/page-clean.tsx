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

  // Initialize user authentication and profile
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get access token
        const tokenRes = await fetch('/api/token');
        const { access_token } = await tokenRes.json();

        if (!access_token) {
          setError('Please log in to continue');
          return;
        }

        setAccessToken(access_token);

        // Fetch user profile
        const profileRes = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        const userData = await profileRes.json();

        if (userData.error) {
          setError(userData.error.message);
        } else {
          setUser(userData);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate with Spotify');
      }
    };

    initializeAuth();
  }, []);

  // Generate playlist based on selected mood
  const generatePlaylist = async (mood: string) => {
    if (!accessToken) {
      alert('Please log in first');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/create-playlist-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: mood.toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create playlist');
      }

      if (!data.playlistId) {
        throw new Error('No playlist ID returned');
      }

      // Navigate to the new playlist
      router.push(`/playlist/${data.playlistId}`);
      
    } catch (error) {
      console.error('Playlist generation error:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate playlist');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  // Show loading state
  if (!user && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your Spotify profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
            <p className="text-red-200">{error}</p>
          </div>
          <button
            onClick={() => window.location.href = '/api/auth'}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Login with Spotify
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* User Welcome Section */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              {user?.images?.[0]?.url && (
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
              Welcome, {user?.display_name}! 👋
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              How are you feeling today? Let&apos;s create the perfect playlist for your mood.
            </p>
          </div>

          {/* Mood Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Choose Your Mood</h2>
            <MoodSelector
              onSelect={generatePlaylist}
              loading={loading}
              disabled={!accessToken}
            />
            
            {/* Loading State */}
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

          {/* Logout Button */}
          <div className="text-center pt-8">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
