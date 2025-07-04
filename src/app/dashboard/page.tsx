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
      console.log('Create playlist response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      if (!data.playlistId) {
        throw new Error('No playlist ID returned from API');
      }

      console.log('Navigating to playlist:', data.playlistId);
      // Navigate to the new playlist
      router.push(`/playlist/${data.playlistId}`);
      
    } catch (error) {
      console.error('Playlist generation error:', error);
      
      // Show more detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate playlist';
      alert(`Error: ${errorMessage}\n\nPlease try again or check your internet connection.`);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4">
                🎵 Moody
              </h1>
              <p className="text-xl text-gray-300 font-light">
                Your Vibe, Your Playlist
              </p>
              <div className="mt-6 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* User Welcome Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                {user?.images?.[0]?.url && (
                  <div className="relative">
                    <Image
                      src={user.images[0].url}
                      alt=""
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-white/30 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white/90 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
              <h2 className="text-4xl font-bold mb-4">
                Welcome back, {user?.display_name}! 👋
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                How are you feeling today? Let&apos;s create the perfect soundtrack for your mood.
              </p>
            </div>
          </div>

          {/* Mood Selection */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Choose Your Mood</h3>
              <p className="text-gray-400">Select the vibe that matches your current energy</p>
            </div>
            
            <MoodSelector
              onSelect={generatePlaylist}
              loading={loading}
              disabled={!accessToken}
            />
            
            {/* Enhanced Loading State */}
            {loading && (
              <div className="mt-12 text-center">
                <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="flex justify-center items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Creating your perfect playlist...</h4>
                  <p className="text-gray-400">Finding tracks that match your vibe</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-8">
              <p className="text-gray-400 mb-4">
                ✨ Powered by Spotify API • Built with Next.js & Tailwind CSS
              </p>
              <div className="flex justify-center items-center space-x-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Connected to Spotify</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              <span className="group-hover:scale-105 inline-block transition-transform">
                👋 Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
