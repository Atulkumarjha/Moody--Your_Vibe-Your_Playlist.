'use client';

import { useState } from 'react';
import { moodToGenres } from '../lib/moodToGenres';

const moods = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Chill', emoji: '😌' },
  { label: 'Energetic', emoji: '⚡' },
  { label: 'Romantic', emoji: '❤️' },
];

export default function MoodSelector({
  onSelect,
  accessToken
}: {
  onSelect: (mood: string) => void;
  accessToken: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlaylist = async (mood: string) => {
    setLoading(true);

    const genres = moodToGenres[mood] || ['pop'];

    try {
      // 1. Get track recommendations
      const recRes = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=20&seed_genres=${genres.join(',')}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const recData = await recRes.json();
      const uris = recData.tracks.map((track: any) => track.uri);

      // 2. Get current user ID
      const userRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();

      // 3. Create new playlist
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
            description: `Auto-generated mood playlist (${mood}) 🎵`,
            public: true,
          }),
        }
      );
      const playlistData = await playlistRes.json();

      // 4. Add tracks to playlist
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris,
          }),
        }
      );

      // ✅ Redirect to playlist preview page
      window.location.href = `/playlist/${playlistData.id}?access_token=${accessToken}`;
    } catch (err) {
      console.error(err);
      alert('Failed to generate playlist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
      <h2 className="text-xl font-semibold text-white">How are you feeling today?</h2>
      <div className="grid grid-cols-3 gap-4">
        {moods.map((m) => (
          <button
            key={m.label}
            className={`p-4 rounded-xl text-3xl transition-all hover:scale-110 ${
              selected === m.label
                ? 'bg-white/30 border border-white text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            onClick={() => {
              setSelected(m.label);
              onSelect(m.label);
              generatePlaylist(m.label);
            }}
            disabled={loading}
          >
            <span role="img" aria-label={m.label}>
              {m.emoji}
            </span>
            <p className="text-sm mt-1">{m.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
