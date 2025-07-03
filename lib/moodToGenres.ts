// This file contains the mood to genre mapping for Spotify recommendations
export const moodToGenres = {
  happy: ['pop', 'dance', 'edm', 'funk', 'disco'],
  sad: ['acoustic', 'piano', 'chill', 'indie-folk', 'ambient'],
  energetic: ['work-out', 'rock', 'techno', 'electronic', 'punk'],
  chill: ['lo-fi', 'ambient', 'chill', 'downtempo', 'chillout'],
  romantic: ['romance', 'rnb', 'soul', 'jazz', 'bossanova'],
} as const;

export type MoodType = keyof typeof moodToGenres;