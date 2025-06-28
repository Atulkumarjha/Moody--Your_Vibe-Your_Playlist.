'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export interface MoodSelectorProps {
  accessToken: string | null;
  onSelect: (mood: string) => void;
  loading: boolean;
}

// Define MoodSelector component
const MoodSelector: React.FC<MoodSelectorProps> = ({ accessToken, onSelect, loading }) => {
  const moods = ['Happy', 'Sad', 'Chill', 'Energetic', 'Romantic'];

  return (
    <div className="flex flex-wrap gap-4">
      {moods.map((mood) => (
        <button
          key={mood}
          className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
            loading
              ? 'bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          onClick={() => !loading && onSelect(mood)}
          disabled={!accessToken || loading}
        >
          {mood}
        </button>
      ))}
    </div>
  );
};

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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch access token from cookie
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

  // Fetch user profile
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

  // Generate playlist function
  const generatePlaylist = async (mood: string) => {
    if (!accessToken) return;

    const moodToGenres: Record<string, string[]> = {
      Happy: ['pop', 'dance', 'happy'],
      Sad: ['acoustic', 'piano', 'emo'],
      Chill: ['lo-fi', 'chill', 'ambient'],
      Energetic: ['rock', 'edm', 'work-out'],
      Romantic: ['romance', 'rnb', 'soul'],
    };

    const genres = moodToGenres[mood] || ['pop'];

    try {
      setLoading(true);

      const recRes = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${genres.join(',')}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const recData = await res.json();
      const uris = recData.tracks.map((track: any) => track.uri);

      const userRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();

      const playlistRes = await fetch(
        `https://api.spotify.com/v1/users/${userData.id}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${mood} Mood Playlist`,
            description: `Mood-based playlist generated for you (${mood}) 🎧`,
            public: true,
          }),
        }
      );
      const playlistData = await playlistRes.json();

      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris }),
        }
      );

      router.push(`/playlist/${playlistData.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate playlist');
    } finally {
      setLoading(false);
    }
  };

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
            loading={loading}
            onSelect={(mood) => {
              setSelectedMood(mood);
              generatePlaylist(mood);
            }}
          />

          {loading && <p className="text-sm text-gray-300">Generating your playlist...</p>}
        </div>
      ) : (
        <p>Loading your Spotify profile...</p>
      )}
    </motion.main>
  );
}
