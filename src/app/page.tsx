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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          Moody
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-200 mb-8 leading-relaxed"
        >
          Generate personalized Spotify playlists based on your mood. 
          Connect with Spotify and let AI curate the perfect soundtrack for any moment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Connect with Spotify
          </button>
          
          <div className="flex justify-center space-x-6 mt-8 text-gray-300">
            <div className="text-center">
              <div className="text-2xl mb-2">🎵</div>
              <p className="text-sm">AI-Powered</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎭</div>
              <p className="text-sm">Mood-Based</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎧</div>
              <p className="text-sm">Personalized</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
