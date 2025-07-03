// This file contains the mood to genre mapping for Spotify recommendations
// Using only basic, guaranteed Spotify genres
export const moodToGenres = {
  happy: ['pop', 'dance'],
  sad: ['acoustic', 'jazz'],
  energetic: ['rock', 'electronic'],
  chill: ['jazz', 'classical'],
  romantic: ['soul', 'blues'],
} as const;

export type MoodType = keyof typeof moodToGenres;