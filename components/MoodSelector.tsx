'use client';

import { motion } from 'framer-motion';

export interface MoodSelectorProps {
  onSelect: (mood: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const moods = [
  { 
    name: 'Happy', 
    emoji: '😊', 
    color: 'from-yellow-400 via-pink-400 to-red-500',
    description: 'Upbeat & Joyful',
    gradient: 'bg-gradient-to-br from-yellow-400/20 to-red-500/20'
  },
  { 
    name: 'Sad', 
    emoji: '😢', 
    color: 'from-blue-900 via-blue-700 to-gray-800',
    description: 'Melancholic & Deep',
    gradient: 'bg-gradient-to-br from-blue-900/20 to-gray-800/20'
  },
  { 
    name: 'Chill', 
    emoji: '😌', 
    color: 'from-teal-400 via-blue-300 to-indigo-600',
    description: 'Relaxed & Calm',
    gradient: 'bg-gradient-to-br from-teal-400/20 to-indigo-600/20'
  },
  { 
    name: 'Energetic', 
    emoji: '⚡', 
    color: 'from-orange-400 via-red-500 to-yellow-400',
    description: 'High Energy & Power',
    gradient: 'bg-gradient-to-br from-orange-400/20 to-yellow-400/20'
  },
  { 
    name: 'Romantic', 
    emoji: '💕', 
    color: 'from-pink-500 via-rose-400 to-purple-600',
    description: 'Love & Passion',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-purple-600/20'
  },
];

export default function MoodSelector({ onSelect, loading, disabled }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {moods.map((mood, index) => (
        <motion.button
          key={mood.name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => !loading && !disabled && onSelect(mood.name)}
          disabled={loading || disabled}
          className={`group relative overflow-hidden rounded-3xl p-8 text-white font-semibold transition-all duration-500 transform ${
            loading || disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-2xl hover:shadow-purple-500/25 cursor-pointer'
          }`}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
          
          {/* Glass Effect Background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          
          {/* Border Glow */}
          <div className="absolute inset-0 rounded-3xl border border-white/20 group-hover:border-white/40 transition-colors duration-300" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
            <motion.span 
              className="text-5xl filter drop-shadow-lg"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {mood.emoji}
            </motion.span>
            <div>
              <h3 className="text-xl font-bold mb-1">{mood.name}</h3>
              <p className="text-sm text-white/80 font-normal">{mood.description}</p>
            </div>
          </div>
          
          {          /* Hover Effect */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
          
          {/* Sparkle Effect on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {/* Loading Overlay */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-3xl"
            >
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
