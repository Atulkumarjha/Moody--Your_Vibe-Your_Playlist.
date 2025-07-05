'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageFallbackProps {
  src: string | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackIcon?: string;
  fallbackClassName?: string;
}

export default function ImageFallback({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  fallbackIcon = '🎵',
  fallbackClassName = ''
}: ImageFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!src || imageError) {
    return (
      <div 
        className={`bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center relative overflow-hidden ${fallbackClassName}`}
        style={{ width, height }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-white drop-shadow-lg filter brightness-110">{fallbackIcon}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-lg"
          style={{ width, height }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-75 animate-pulse"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoading(false)}
      />
    </div>
  );
}
