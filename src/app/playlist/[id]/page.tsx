'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  external_urls: {
    spotify: string;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  tracks: {
    total: number;
    items: Array<{
      track: {
        id: string;
        name: string;
        artists: Array<{
          name: string;
        }>;
        album: {
          name: string;
          images: Array<{
            url: string;
          }>;
        };
        external_urls: {
          spotify: string;
        };
        preview_url?: string;
      };
    }>;
  };
}

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const router = useRouter();

  // Resolve params asynchronously
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setPlaylistId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!playlistId) return;

    const getTokenAndPlaylist = async () => {
      try {
        // Get access token
        const tokenRes = await fetch('/api/token');
        const { access_token } = await tokenRes.json();
        
        if (!access_token) {
          setError('Not authenticated');
          router.push('/');
          return;
        }
        
        setAccessToken(access_token);

        // Fetch playlist details
        const playlistRes = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}?fields=id,name,description,external_urls,images,tracks(total,items(track(id,name,artists(name),album(name,images),external_urls,preview_url)))`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (!playlistRes.ok) {
          const errorText = await playlistRes.text();
          console.error('Playlist fetch error:', playlistRes.status, errorText);
          throw new Error(`Failed to fetch playlist: ${playlistRes.status} ${errorText}`);
        }

        const playlistData = await playlistRes.json();
        
        // Handle cases where playlist might not have tracks yet (newly created)
        if (!playlistData.tracks) {
          // If tracks field is missing, try to get it with a simpler request
          const simpleRes = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          
          if (simpleRes.ok) {
            const simpleData = await simpleRes.json();
            setPlaylist({
              ...simpleData,
              tracks: simpleData.tracks || { total: 0, items: [] }
            });
          } else {
            throw new Error('Failed to fetch playlist details');
          }
        } else {
          // Ensure tracks.items exists even if empty
          if (!playlistData.tracks.items) {
            playlistData.tracks.items = [];
          }
          setPlaylist(playlistData);
        }
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError(err instanceof Error ? err.message : 'Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };

    getTokenAndPlaylist();
  }, [playlistId, router]);

  const savePlaylist = async () => {
    if (!playlist || !accessToken) return;

    try {
      const response = await fetch('/api/save-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistId: playlist.id,
          name: playlist.name,
          description: playlist.description,
        }),
      });

      if (response.ok) {
        alert('Playlist saved to your account!');
      } else {
        alert('Failed to save playlist');
      }
    } catch (err) {
      console.error('Error saving playlist:', err);
      alert('Failed to save playlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-white/20 border-t-white mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🎵</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Loading your playlist...</h2>
          <p className="text-gray-300">Getting all those amazing tracks ready for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto">
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
            <p className="text-red-200 mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-purple-500 hover:bg-purple-600 px-8 py-4 rounded-2xl font-semibold transition-colors"
            >
              🏠 Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold mb-4">Playlist not found</h1>
          <p className="text-gray-300 mb-8">The playlist you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-purple-500 hover:bg-purple-600 px-8 py-4 rounded-2xl font-semibold transition-colors"
          >
            🔄 Create New Playlist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Playlist Cover */}
                <div className="relative">
                  {playlist.images?.[0] ? (
                    <Image
                      src={playlist.images[0].url}
                      alt=""
                      width={240}
                      height={240}
                      className="rounded-2xl shadow-2xl border-4 border-white/20"
                    />
                  ) : (
                    <div className="w-60 h-60 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl border-4 border-white/20 flex items-center justify-center">
                      <span className="text-6xl">🎵</span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-12 h-12 rounded-full border-4 border-white/90 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">▶</span>
                  </div>
                </div>
                
                {/* Playlist Info */}
                <div className="flex-1 text-center lg:text-left">
                  <p className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">
                    Playlist
                  </p>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {playlist.name}
                  </h1>
                  <p className="text-xl text-gray-300 mb-6 max-w-2xl">
                    {playlist.description}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 mb-6">
                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                      🎵 {playlist.tracks.total} tracks
                    </span>
                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                      ⏱️ ~{Math.round(playlist.tracks.total * 3.5)} min
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <a
                      href={playlist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-3"
                    >
                      <span className="text-xl">🎧</span>
                      <span className="group-hover:scale-105 inline-block transition-transform">
                        Open in Spotify
                      </span>
                    </a>
                    <button
                      onClick={savePlaylist}
                      className="group bg-blue-500/20 hover:bg-blue-500/30 border-2 border-blue-500/30 hover:border-blue-500/50 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
                    >
                      <span className="text-xl">💾</span>
                      <span className="group-hover:scale-105 inline-block transition-transform">
                        Save Playlist
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="group bg-purple-500/20 hover:bg-purple-500/30 border-2 border-purple-500/30 hover:border-purple-500/50 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
                    >
                      <span className="text-xl">🔄</span>
                      <span className="group-hover:scale-105 inline-block transition-transform">
                        Create Another
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tracks Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🎵</span>
              <h2 className="text-3xl font-bold">Tracks</h2>
            </div>
            
            {!playlist.tracks.items || playlist.tracks.items.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">😔</div>
                <h3 className="text-2xl font-bold mb-4">No tracks found</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  This might be due to a sync delay. Try refreshing the page or check the playlist in Spotify.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-2xl font-semibold transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {playlist.tracks.items.map((item, index) => (
                  <motion.div
                    key={item.track.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="group bg-white/5 hover:bg-white/10 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 border border-white/5 hover:border-white/20"
                  >
                    <div className="flex items-center gap-5">
                      {/* Track Number */}
                      <div className="text-gray-400 font-mono text-base w-8 text-center group-hover:text-white transition-colors">
                        {index + 1}
                      </div>
                      
                      {/* Album Art */}
                      <div className="relative group/image">
                        {item.track.album.images?.[0] ? (
                          <Image
                            src={item.track.album.images[0].url}
                            alt=""
                            width={60}
                            height={60}
                            className="rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-white/10 group-hover:border-white/20"
                          />
                        ) : (
                          <div className="w-15 h-15 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center border-2 border-white/10">
                            <span className="text-xl">🎵</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center">
                            <span className="text-white text-xs">▶</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-white group-hover:text-purple-200 transition-colors duration-300 truncate mb-1">
                          {item.track.name}
                        </h3>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 truncate text-sm">
                          <span className="font-medium">
                            {item.track.artists.map(artist => artist.name).join(', ')}
                          </span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="italic text-gray-500">
                            {item.track.album.name}
                          </span>
                        </p>
                        {/* Duration estimate */}
                        <p className="text-xs text-gray-500 mt-1">
                          ⏱️ ~3:30
                        </p>
                      </div>
                      
                      {/* External Link */}
                      <a
                        href={item.track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link bg-green-500/20 hover:bg-green-500/30 p-3 rounded-xl transition-all duration-300 hover:scale-110"
                        title="Open in Spotify"
                      >
                        <svg 
                          className="w-5 h-5 text-green-400 group-hover/link:text-green-300 transition-colors" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14.5c-.203 0-.402-.097-.527-.27-.206-.283-.143-.678.14-.884 2.041-1.49 2.556-4.345 1.174-6.49-.206-.32-.12-.747.2-.953.32-.203.747-.12.953.2 1.79 2.778 1.125 6.49-1.52 8.57-.113.08-.24.12-.37.12l-.05.007zm1.5-3.5c-.15 0-.303-.07-.4-.2-.16-.22-.11-.53.11-.69 1.22-.89 1.53-2.63.72-3.96-.13-.22-.05-.5.17-.63.22-.13.5-.05.63.17 1.05 1.72.65 3.94-.93 5.06-.08.06-.17.09-.26.09l-.04.006zm1.5-3.5c-.1 0-.2-.04-.27-.11-.1-.1-.1-.26 0-.36.6-.6.6-1.57 0-2.17-.1-.1-.1-.26 0-.36.1-.1.26-.1.36 0 .8.8.8 2.09 0 2.89-.05.05-.11.08-.17.08l-.02.003z"/>
                        </svg>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
