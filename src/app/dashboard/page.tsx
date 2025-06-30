'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MoodSelectorProps {
  accessToken: string;
  onSelect: (mood: string) => void;
}

const moods = ['Happy', 'Sad', 'Chill', 'Energetic', 'Romantic'];

const moodToGenres: Record<string, string[]> = {
  Happy: ['pop', 'dance', 'happy'],
  Sad: ['acoustic', 'piano', 'emo'],
  Chill: ['lo-fi', 'chill', 'ambient'],
  Energetic: ['rock', 'edm', 'work-out'],
  Romantic: ['romance', 'rnb', 'soul'],
};

export default function MoodSelector({ accessToken, onSelect }: MoodSelectorProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generatePlaylist = async (mood: string) => {
    const genres = moodToGenres[mood] || ['pop'];

    try {
      setLoading(true);

      // Get recommendations
      const recRes = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${genres.join(',')}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const recData = await recRes.json();
      const uris = recData.tracks.map((track: any) => track.uri);

      // Get user ID
      const userRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();

      // Create playlist
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
            description: `Mood-based playlist for: ${mood} 🎧`,
            public: true,
          }),
        }
      );
      const playlistData = await playlistRes.json();

      // Add tracks to playlist
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

      // Redirect
      router.push(`/playlist/${playlistData.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {moods.map((mood) => (
        <button
          key={mood}
          onClick={() => {
            if (!loading) {
              onSelect(mood);
              generatePlaylist(mood);
            }
          }}
          disabled={loading}
          className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all ${
            loading
              ? 'bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
        >
          {mood}
        </button>
      ))}

      <button className='mt-6 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white'
      onClick={() => {
        window.location.href = '/api/auth/logout';
      }}>
        Logout
      </button>

      {loading && <p className="text-sm text-gray-300 w-full">Generating playlist...</p>}
    </div>
  );
}
