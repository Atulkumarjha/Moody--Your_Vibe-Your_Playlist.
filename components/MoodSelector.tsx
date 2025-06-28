'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MoodSelector from '../../mood-playlist-generator/components/MoodSelector';
import { motion } from 'framer-motion';


const moodColors: Record<string, string> = {
  Happy: 'from-yellow-400 via-pink-400 to-red-500',
  Sad: 'from-blue-900 via-blue-700 to-gray-800',
  Chill: 'from-teal-400 via-blue-300 to-indigo-600',
  Energetic: 'from-orange-400 via-red-500 to-yellow-400',
  Romantic: 'from-pink-500 via-rose-400 to-purple-600',
};

export default function Dashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const router = useRouter();

  // ✅ Step 1: Fetch token from secure cookie via API route
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch('/api/token');
        const { access_token } = await res.json();
        if (!access_token) {
          setError('Access token missing');
        } else {
          setAccessToken(access_token);
        }
      } catch {
        setError('Failed to retrieve access token');
      }
    };

    getToken();
  }, []);

  // ✅ Step 2: Fetch user profile from Spotify
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) return;

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
  }, [accessToken]);

  const gradient = selectedMood
    ? moodColors[selectedMood]
    : 'from-black via-gray-900 to-zinc-800';

  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`p-8 text-white bg-gradient-to-br ${gradient} min-h-screen`}
    >
      {error && <p className="text-red-500">Error: {error}</p>}
      {!accessToken && <p className="text-red-500">Missing access token</p>}

      {user ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Welcome, {user.display_name} 👋</h1>
            <p>Email: {user.email}</p>
            <img src={user.images?.[0]?.url} alt="Profile" className="w-24 h-24 rounded-full" />
          </div>

          <MoodSelector
            accessToken={accessToken}
            onSelect={(mood) => {
              console.log(`Mood selected: ${mood}`);
              setSelectedMood(mood);
            }}
          />
        </div>
      ) : (
        <p>Loading your Spotify profile...</p>
      )}
    </motion.main>
  );
}
