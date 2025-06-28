'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';

export default function PlaylistPage() {
  const [playlist, setPlaylist] = useState<any>(null);
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
      } catch (err) {
        setError('Failed to load playlist.');
      }
    };

    if(token) fetchPlaylist();
}, [id, token]);

if(error) return <p className='text-red-500 p-8'> Error: {error}</p>;
if(!playlist) return <p className='p-8 text-white'>Loading Playlist...</p>;

return (
  <main className='p-8 text-white bg-gradient-to-br from-black via-gray-900 to-zinc-800 min-h-screen'>
    <div className='flex items-center space-x-6 mb-8'>
      <img
      src={playlist.images?.[0]?.url}
      alt={playlist.name}
      className='w-40 h-40 rounded-lg shadow-xl'
      />
    <div>
      <h1 className='text-3xl font-bold'>{playlist.name}</h1>
      <p className='text-gray-300'>{playlist.desription}</p>
      <p className='text-sm text-gray-400 mt-2'>
        {playlist.tracks.total} songs - by {playlist.owner.display_name}
        </p>
        </div>
        </div>

        <div className='space-y-4'>
          {playlist.tracks.items.map((item: AnyMxRecord, index: number) => {
            const track = item.track;

            return (
              <div
              key={track.id}
              className='flex items-center justify-between p-4 bg-white/5 roudned-lg'
              >
                <div className='flex items-center space-x-4'>
                  <img
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  className='w-12 h-12 rounded'
                  />
                  <div>
                    <p className='font-medium'>{track.name}</p>
                    <p className='text-sm text-gray-400'>{track.artists.map((a: any) => a.name).join(', ')}</p>
                    </div>              
                </div>
                <p className='text-sm text-gray-300'>{track.album.name}</p>
                </div>
            );
          })}
        </div>
  </main>
)