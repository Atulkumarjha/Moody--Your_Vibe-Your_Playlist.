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
    color: 'from-yellow-400 via-orange-400 to-red-500',
    description: 'Upbeat & Joyful',
    gradient: 'bg-gradient-to-br from-yellow-400/20 to-red-500/20',
    shadowColor: 'shadow-yellow-400/25'
  },
  { 
    name: 'Sad', 
    emoji: '😢', 
    color: 'from-blue-900 via-indigo-700 to-purple-800',
    description: 'Melancholic & Deep',
    gradient: 'bg-gradient-to-br from-blue-900/20 to-purple-800/20',
    shadowColor: 'shadow-blue-400/25'
  },
  { 
    name: 'Chill', 
    emoji: '😌', 
    color: 'from-teal-400 via-cyan-400 to-blue-500',
    description: 'Relaxed & Calm',
    gradient: 'bg-gradient-to-br from-teal-400/20 to-blue-500/20',
    shadowColor: 'shadow-teal-400/25'
  },
  { 
    name: 'Energetic', 
    emoji: '⚡', 
    color: 'from-orange-400 via-red-500 to-pink-500',
    description: 'High Energy & Power',
    gradient: 'bg-gradient-to-br from-orange-400/20 to-pink-500/20',
    shadowColor: 'shadow-orange-400/25'
  },
  { 
    name: 'Romantic', 
    emoji: '💕', 
    color: 'from-pink-500 via-rose-400 to-purple-600',
    description: 'Love & Passion',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-purple-600/20',
    shadowColor: 'shadow-pink-400/25'
  },
];

export default function MoodSelector({ onSelect, loading, disabled }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
      {moods.map((mood, index) => (
        <motion.button
          key={mood.name}
          initial={{ opacity: 0, y: 40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.08, y: -8 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => !loading && !disabled && onSelect(mood.name)}
          disabled={loading || disabled}
          className={`group relative overflow-hidden rounded-3xl p-8 text-white font-bold transition-all duration-500 transform min-h-[180px] ${
            loading || disabled
              ? 'opacity-50 cursor-not-allowed'
              : `hover:shadow-2xl hover:${mood.shadowColor} cursor-pointer`
          }`}
        >
          {/* Enhanced Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-85 group-hover:opacity-95 transition-opacity duration-300`} />
          
          {/* Enhanced Glass Effect */}
          <div className="absolute inset-0 bg-white/15 backdrop-blur-lg group-hover:bg-white/20 transition-colors duration-300" />
          
          {/* Enhanced Border Glow */}
          <div className="absolute inset-0 rounded-3xl border-2 border-white/30 group-hover:border-white/50 transition-colors duration-300" />
          
          {/* Enhanced Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-3 left-3 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-4 left-6 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-6 right-4 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center space-y-4 text-center h-full justify-center">
            <motion.span 
              className="text-5xl filter drop-shadow-2xl"
              whileHover={{ scale: 1.3, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {mood.emoji}
            </motion.span>
            <div>
              <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{mood.name}</h3>
              <p className="text-sm text-white/90 font-medium drop-shadow-sm">{mood.description}</p>
            </div>
          </div>
          
          {/* Enhanced Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/0 to-white/0 group-hover:from-white/5 group-hover:via-white/10 group-hover:to-white/5 transition-all duration-500" />
          
          {/* Enhanced Loading Overlay */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center rounded-3xl"
            >
              <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}
