'use client';

import { useState } from 'react';

const moods = [
  { label: 'Happy', emoji: '😊' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Chill', emoji: '😌' },
  { label: 'Energetic', emoji: '⚡' },
  { label: 'Romantic', emoji: '❤️' },
];

export default function MoodSelector({ onSelect }: { onSelect: (mood: string) => void }) {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div className='flex flex-col items-center space-y-6 p-8 rounded 2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl'>
            <h2 className='text-xl font-semibold text-white'>How are you feeling today?</h2>
            <div className='grid grid-cols-3 gap-4'>
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
                onSelect{m.label};
            }}
            >
                <span role='img' artis-label={m.label}>
                    {m.emoji}
                </span>
                <p className='text-sm mt-1'>{m.label}</p>
            </button>
                ))}
            </div>
        </div>
    )
}