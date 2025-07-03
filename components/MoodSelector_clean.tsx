'use client';

import { motion } from 'framer-motion';

export interface MoodSelectorProps {
  onSelect: (mood: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const moods = [
  { name: 'Happy', emoji: '😊', color: 'from-yellow-400 via-pink-400 to-red-500' },
  { name: 'Sad', emoji: '😢', color: 'from-blue-900 via-blue-700 to-gray-800' },
  { name: 'Chill', emoji: '😌', color: 'from-teal-400 via-blue-300 to-indigo-600' },
  { name: 'Energetic', emoji: '⚡', color: 'from-orange-400 via-red-500 to-yellow-400' },
  { name: 'Romantic', emoji: '💕', color: 'from-pink-500 via-rose-400 to-purple-600' },
];

export default function MoodSelector({ onSelect, loading, disabled }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {moods.map((mood, index) => (
        <motion.button
          key={mood.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => !loading && !disabled && onSelect(mood.name)}
          disabled={loading || disabled}
          className={`relative overflow-hidden rounded-2xl p-6 text-white font-semibold text-lg transition-all duration-300 ${
            loading || disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-2xl cursor-pointer'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-90`} />
          <div className="relative z-10 flex flex-col items-center space-y-2">
            <span className="text-3xl">{mood.emoji}</span>
            <span>{mood.name}</span>
          </div>
          {loading && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
