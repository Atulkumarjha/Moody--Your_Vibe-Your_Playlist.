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