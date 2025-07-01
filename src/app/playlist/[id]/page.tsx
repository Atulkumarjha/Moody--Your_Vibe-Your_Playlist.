'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
}

interface PlaylistItem {
  track: Track;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  tracks: {
    total: number;
    items: PlaylistItem[];
  };
  owner: {
    display_name: string;
  };
}

function PlaylistContent() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [error, setError] = useState('');
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const token = searchParams.get('access_token');

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.error) {
          setError(data.error.message);
        } else {
          setPlaylist(data);
        }
      } catch {
        setError('Failed to load playlist.');
      }
    };

    if(token) fetchPlaylist();
}, [id, token]);

if(error) return <p className='text-red-500 p-8'> Error: {error}</p>;
if(!playlist) return <p className='p-8 text-white'>Loading Playlist...</p>;

return (
  <motion.main 
  initial={{ opacity: 0,y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className='p-8 text-white bg-gradient-to-br from-black via-gray-900 to-zinc-800 min-h-screen'>
    <div className='flex items-center space-x-6 mb-8'>
      {playlist.images?.[0]?.url ? (
        <Image
          src={playlist.images[0].url}
          alt={playlist.name}
          width={160}
          height={160}
          className='rounded-lg shadow-xl'
        />
      ) : (
        <div className='w-40 h-40 bg-gray-600 rounded-lg shadow-xl flex items-center justify-center'>
          <span className='text-gray-400'>No Image</span>
        </div>
      )}
    <div>
      <h1 className='text-3xl font-bold'>{playlist.name}</h1>
      <p className='text-gray-300'>{playlist.description}</p>
      <p className='text-sm text-gray-400 mt-2'>
        {playlist.tracks.total} songs - by {playlist.owner.display_name}
        </p>
        </div>
        </div>

        <div className='space-y-4'>
          {playlist.tracks.items.map((item: PlaylistItem) => {
            const track = item.track;

            return (
              <div
              key={track.id}
              className='flex items-center justify-between p-4 bg-white/5 rounded-lg'
              >
                <div className='flex items-center space-x-4'>
                  {track.album.images[0]?.url ? (
                    <Image
                      src={track.album.images[0].url}
                      alt={track.name}
                      width={48}
                      height={48}
                      className='rounded'
                    />
                  ) : (
                    <div className='w-12 h-12 bg-gray-600 rounded flex items-center justify-center'>
                      <span className='text-xs text-gray-400'>♪</span>
                    </div>
                  )}
                  <div>
                    <p className='font-medium'>{track.name}</p>
                    <p className='text-sm text-gray-400'>{track.artists.map((artist) => artist.name).join(', ')}</p>
                    </div>              
                </div>
                <p className='text-sm text-gray-300'>{track.album.name}</p>
                </div>
            );
          })}
        </div>
  </motion.main>
);
}

export default function PlaylistPage() {
  return (
    <Suspense fallback={<div className='p-8 text-white'>Loading...</div>}>
      <PlaylistContent />
    </Suspense>
  );
}