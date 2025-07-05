'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/token');
        const { access_token } = await res.json();
        
        if (access_token) {
          setIsLoggedIn(true);
          router.push('/dashboard');
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = () => {
    window.location.href = '/api/auth';
  };

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="text-center text-white relative z-10">
          <div className="mb-8">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-6 animate-pulse">
              🎵 Moody
            </h1>
            <p className="text-2xl text-gray-300 mb-8">Loading your musical journey...</p>
          </div>
          <div className="flex justify-center items-center space-x-6">
            <div className="w-6 h-6 bg-purple-400 rounded-full animate-bounce shadow-2xl shadow-purple-400/50"></div>
            <div className="w-6 h-6 bg-pink-400 rounded-full animate-bounce shadow-2xl shadow-pink-400/50" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-6 h-6 bg-red-400 rounded-full animate-bounce shadow-2xl shadow-red-400/50" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500/15 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.3) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto relative z-10"
      >
        {/* Enhanced Welcome Section */}
        <div className="bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl mb-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-16 translate-x-16 filter blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full translate-y-12 -translate-x-12 filter blur-2xl"></div>
          
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-8xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl relative z-10"
          >
            🎵 Moody
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl text-gray-200 mb-6 leading-relaxed relative z-10"
          >
            Your Vibe, Your Playlist
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto relative z-10"
          >
            Transform your emotions into the perfect soundtrack. Connect with Spotify and let our AI curate personalized playlists that match your mood and energy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-8 relative z-10"
          >
            <button
              onClick={handleLogin}
              className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-6 px-12 rounded-3xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/30 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-2xl">🎧</span>
                Connect with Spotify
              </span>
            </button>
          </motion.div>
        </div>
        
        {/* Enhanced Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🎯</div>
            <h3 className="text-2xl font-bold mb-4 text-white">Mood Detection</h3>
            <p className="text-gray-300 text-lg">Advanced AI analyzes your emotional state to find the perfect musical match</p>
          </div>
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">�</div>
            <h3 className="text-2xl font-bold mb-4 text-white">Spotify Integration</h3>
            <p className="text-gray-300 text-lg">Seamlessly connected to your Spotify account with full playlist management</p>
          </div>
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">⚡</div>
            <h3 className="text-2xl font-bold mb-4 text-white">Instant Playlists</h3>
            <p className="text-gray-300 text-lg">Generate curated playlists in seconds with our lightning-fast AI engine</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
