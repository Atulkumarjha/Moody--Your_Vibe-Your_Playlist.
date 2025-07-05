'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

export default function LoadingSkeleton({ 
  width = '100%', 
  height = '20px', 
  className = '',
  rounded = 'md'
}: LoadingSkeletonProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
  };

  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
      animate={{
        background: [
          'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)',
          'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
          'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}
