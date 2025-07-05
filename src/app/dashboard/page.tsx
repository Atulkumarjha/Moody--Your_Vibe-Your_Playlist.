'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import MoodSelector from '../../../components/MoodSelector';
import ImageFallback from '../../../components/ImageFallback';

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
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
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
    setSelectedMood(mood);
    
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
      setSelectedMood(null);
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
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
                🎵 Moody
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 font-light mb-4">
                Your Vibe, Your Playlist
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Transform your emotions into the perfect soundtrack with AI-powered playlist generation
              </p>
              <div className="mt-8 flex justify-center space-x-3">
                <div className="w-4 h-4 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* Enhanced User Welcome Section */}
          <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-12 mb-16 border border-white/20 shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-16 translate-x-16 filter blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full translate-y-12 -translate-x-12 filter blur-2xl"></div>
            
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center mb-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <ImageFallback
                    src={user?.images?.[0]?.url}
                    alt=""
                    width={140}
                    height={140}
                    className="rounded-full border-4 border-white/40 shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-300"
                    fallbackIcon="👤"
                    fallbackClassName="rounded-full border-4 border-white/40 shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-300 text-6xl"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-green-400 to-emerald-500 w-12 h-12 rounded-full border-4 border-white/90 flex items-center justify-center shadow-lg animate-pulse">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                Welcome back, {user?.display_name}! 👋
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                How are you feeling today? Let&apos;s create the perfect soundtrack for your mood and discover new music that matches your energy.
              </p>
            </div>
          </div>

          {/* Enhanced Mood Selection */}
          <div className="bg-gradient-to-b from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5"></div>
            
            <div className="text-center mb-12 relative z-10">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent">
                Choose Your Mood
              </h3>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Select the vibe that matches your current energy and let our AI curate the perfect playlist just for you
              </p>
            </div>
            
            <MoodSelector
              onSelect={generatePlaylist}
              loading={loading}
              selectedMood={selectedMood || undefined}
              disabled={!accessToken}
            />
            
            {/* Enhanced Loading State */}
            {loading && (
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-3xl p-12 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden">
                  {/* Loading Animation Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center items-center space-x-4 mb-6">
                      <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50"></div>
                      <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-4 h-4 bg-red-400 rounded-full animate-bounce shadow-lg shadow-red-400/50" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <h4 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      Creating your perfect playlist...
                    </h4>
                    <p className="text-lg text-gray-400 max-w-md mx-auto">
                      Finding tracks that match your vibe and energy
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 mb-8 border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-1/2 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-x-10 -translate-y-10 filter blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-center items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-sm text-green-400 font-medium">Connected to Spotify</span>
                  </div>
                  <div className="w-px h-6 bg-white/20"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                    <span className="text-sm text-blue-400 font-medium">AI-Powered</span>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6 text-lg">
                  ✨ Powered by Spotify API • Built with Next.js & Tailwind CSS • Enhanced with AI
                </p>
                
                <div className="flex justify-center space-x-4">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="group bg-gradient-to-r from-red-500/20 via-red-400/20 to-red-500/20 hover:from-red-500/30 hover:via-red-400/30 hover:to-red-500/30 border-2 border-red-500/30 hover:border-red-400/50 px-10 py-5 rounded-3xl font-bold text-lg transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-red-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              <span className="relative z-10 group-hover:scale-105 inline-block transition-transform duration-300">
                👋 Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
