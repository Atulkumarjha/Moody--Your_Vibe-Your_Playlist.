// This file contains the mood to genre mapping for Spotify recommendations
// These are validated Spotify genre seeds
export const moodToGenres = {
  happy: ['pop', 'dance', 'funk', 'disco', 'happy'],
  sad: ['acoustic', 'piano', 'chill', 'indie', 'ambient'],
  energetic: ['work-out', 'rock', 'techno', 'electronic', 'punk'],
  chill: ['chill', 'ambient', 'downtempo', 'study', 'sleep'],
  romantic: ['romance', 'r-n-b', 'soul', 'jazz', 'bossanova'],
} as const;

export type MoodType = keyof typeof moodToGenres;