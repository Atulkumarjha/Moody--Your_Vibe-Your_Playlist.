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
          throw new Error('Failed to fetch playlist');
        }

        const playlistData = await playlistRes.json();
        
        if (!playlistData.tracks || !playlistData.tracks.items) {
          throw new Error('Invalid playlist data received');
        }
        
        setPlaylist(playlistData);
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
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold">Playlist not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-6 mb-6">
            {playlist.images?.[0] && (
              <Image
                src={playlist.images[0].url}
                alt={playlist.name}
                width={200}
                height={200}
                className="rounded-lg shadow-lg"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
              <p className="text-gray-300 mb-4">{playlist.description}</p>
              <p className="text-sm text-gray-400 mb-4">
                {playlist.tracks.total} tracks
              </p>
              <div className="flex gap-4">
                <a
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Open in Spotify
                </a>
                <button
                  onClick={savePlaylist}
                  className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Save Playlist
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 rounded-lg p-6 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold mb-4">Tracks</h2>
          {!playlist.tracks.items || playlist.tracks.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No tracks found in this playlist</p>
              <p className="text-sm text-gray-500">
                This might be due to a sync delay. Try refreshing the page or check the playlist in Spotify.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {playlist.tracks.items.map((item, index) => (
                <motion.div
                  key={item.track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="text-gray-400 w-8 text-center">
                    {index + 1}
                  </div>
                  {item.track.album.images?.[0] && (
                    <Image
                      src={item.track.album.images[0].url}
                      alt={item.track.album.name}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.track.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {item.track.artists.map(artist => artist.name).join(', ')} • {item.track.album.name}
                    </p>
                  </div>
                  <a
                    href={item.track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12l-2-2m0 0l2-2m-2 2h8m-8 0H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2h-2" />
                    </svg>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
