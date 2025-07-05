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
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-20 translate-x-20 filter blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full translate-y-16 -translate-x-16 filter blur-3xl"></div>
              
              <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                {/* Enhanced Playlist Cover */}
                <div className="relative group">
                  {playlist.images?.[0] ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-3xl blur-2xl scale-110 opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Image
                        src={playlist.images[0].url}
                        alt=""
                        width={280}
                        height={280}
                        className="rounded-3xl shadow-2xl border-4 border-white/30 relative z-10 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-70 h-70 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl border-4 border-white/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <span className="text-8xl">🎵</span>
                    </div>
                  )}
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-400 to-emerald-500 w-16 h-16 rounded-full border-4 border-white/90 flex items-center justify-center shadow-2xl animate-pulse">
                    <span className="text-white text-2xl">▶</span>
                  </div>
                </div>
                
                {/* Enhanced Playlist Info */}
                <div className="flex-1 text-center lg:text-left">
                  <p className="text-sm font-bold text-purple-300 mb-3 uppercase tracking-wider">
                    🎵 Playlist
                  </p>
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-2xl">
                    {playlist.name}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl leading-relaxed">
                    {playlist.description}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mb-8">
                    <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg">
                      <span className="text-lg font-bold">🎵 {playlist.tracks.total} tracks</span>
                    </div>
                    <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg">
                      <span className="text-lg font-bold">⏱️ ~{Math.round(playlist.tracks.total * 3.5)} min</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                    <a
                      href={playlist.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-10 py-5 rounded-3xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-green-500/50 flex items-center gap-4 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/30 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                      <span className="text-2xl relative z-10">🎧</span>
                      <span className="group-hover:scale-105 inline-block transition-transform relative z-10">
                        Open in Spotify
                      </span>
                    </a>
                    <button
                      onClick={savePlaylist}
                      className="group bg-gradient-to-r from-blue-500/20 via-blue-400/20 to-blue-500/20 hover:from-blue-500/30 hover:via-blue-400/30 hover:to-blue-500/30 border-2 border-blue-500/30 hover:border-blue-400/50 px-10 py-5 rounded-3xl font-bold text-lg transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-blue-500/25 flex items-center gap-4 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                      <span className="text-2xl relative z-10">💾</span>
                      <span className="group-hover:scale-105 inline-block transition-transform relative z-10">
                        Save Playlist
                      </span>
                    </button>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="group bg-gradient-to-r from-purple-500/20 via-purple-400/20 to-purple-500/20 hover:from-purple-500/30 hover:via-purple-400/30 hover:to-purple-500/30 border-2 border-purple-500/30 hover:border-purple-400/50 px-10 py-5 rounded-3xl font-bold text-lg transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-purple-500/25 flex items-center gap-4 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/20 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                      <span className="text-2xl relative z-10">🔄</span>
                      <span className="group-hover:scale-105 inline-block transition-transform relative z-10">
                        Create Another
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Tracks Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gradient-to-b from-white/5 via-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5"></div>
            
            <div className="flex items-center gap-4 mb-12 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🎵</span>
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Tracks</h2>
                <p className="text-gray-400 text-lg">Your curated music collection</p>
              </div>
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
              <div className="space-y-4 relative z-10">
                {playlist.tracks.items.map((item, index) => (
                  <motion.div
                    key={item.track.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    className="group bg-gradient-to-r from-white/5 via-white/10 to-white/5 hover:from-white/15 hover:via-white/20 hover:to-white/15 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 border border-white/10 hover:border-white/30 relative overflow-hidden"
                  >
                    {/* Hover Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                      {/* Enhanced Track Number */}
                      <div className="text-gray-400 font-mono text-lg w-10 text-center group-hover:text-purple-300 transition-colors duration-300 font-bold">
                        {index + 1}
                      </div>
                      
                      {/* Enhanced Album Art */}
                      <div className="relative group/image">
                        {item.track.album.images?.[0] ? (
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-2xl blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            <Image
                              src={item.track.album.images[0].url}
                              alt=""
                              width={72}
                              height={72}
                              className="rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border-2 border-white/20 group-hover:border-white/40 relative z-10 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="w-18 h-18 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center border-2 border-white/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-2xl">🎵</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-2xl transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg">▶</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Track Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-white group-hover:text-purple-200 transition-colors duration-300 truncate mb-2">
                          {item.track.name}
                        </h3>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 truncate text-base mb-1">
                          <span className="font-semibold">
                            {item.track.artists.map(artist => artist.name).join(', ')}
                          </span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="italic text-gray-500">
                            {item.track.album.name}
                          </span>
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <span>⏱️</span>
                            <span>~3:30</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🎧</span>
                            <span>High Quality</span>
                          </span>
                        </div>
                      </div>
                      
                      {/* Enhanced External Link */}
                      <a
                        href={item.track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 p-4 rounded-2xl transition-all duration-300 hover:scale-110 border border-green-500/20 hover:border-green-400/40 shadow-lg hover:shadow-green-500/25"
                        title="Open in Spotify"
                      >
                        <svg 
                          className="w-6 h-6 text-green-400 group-hover/link:text-green-300 transition-colors" 
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
