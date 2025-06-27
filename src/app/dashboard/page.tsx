'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromQuery = searchParams.get('access_token');

    if (tokenFromQuery) {
      localStorage.setItem('spotify_access_token', tokenFromQuery);
    }

    const accessToken = tokenFromQuery || localStorage.getItem('spotify_access_token');

    const fetchUserProfile = async () => {
      if (!accessToken) {
        setError('Access token missing');
        return;
      }

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
      } catch (err) {
        setError('Failed to fetch user');
      }
    };

    fetchUserProfile();
  }, [searchParams]);

  return (
    <main className="p-8 text-white bg-gradient-to-br from-black via-gray-900 to-zinc-800 min-h-screen">
      {error && <p className="text-red-500">Error: {error}</p>}
      {user ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Welcome, {user.display_name} 👋</h1>
          <p>Email: {user.email}</p>
          <img src={user.images?.[0]?.url} alt="Profile" className="w-24 h-24 rounded-full" />
        </div>
      ) : (
        <p>Loading your Spotify profile...</p>
      )}
    </main>
  );
}
