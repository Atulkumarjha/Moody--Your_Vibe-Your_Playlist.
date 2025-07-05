'use client';

interface MusicIconProps {
  type: 'playlist' | 'track' | 'album' | 'artist' | 'user' | 'loading';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function MusicIcon({ type, size = 'md', className = '' }: MusicIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xl',
    md: 'w-8 h-8 text-2xl',
    lg: 'w-12 h-12 text-4xl',
    xl: 'w-16 h-16 text-6xl'
  };

  const icons = {
    playlist: '🎵',
    track: '🎶',
    album: '💿',
    artist: '🎤',
    user: '👤',
    loading: '⏳'
  };

  return (
    <div className={`
      bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 
      ${sizeClasses[size]} 
      rounded-xl 
      flex items-center justify-center 
      shadow-lg 
      border-2 border-white/20 
      relative overflow-hidden 
      ${className}
    `}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>
      <span className="relative z-10 text-white drop-shadow-lg filter brightness-110">
        {icons[type]}
      </span>
    </div>
  );
}
