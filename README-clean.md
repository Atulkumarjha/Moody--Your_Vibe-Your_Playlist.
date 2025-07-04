# 🎵 Moody - Your Vibe, Your Playlist

A beautiful Next.js application that creates personalized Spotify playlists based on your current mood. Built with TypeScript, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Mood-Based Playlists**: Choose from 5 different moods (Happy, Sad, Energetic, Chill, Romantic)
- **Spotify Integration**: Seamless authentication and playlist creation
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Instant Creation**: Fast playlist generation using Spotify's search API
- **Personal Touch**: Customized playlist names and descriptions

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Authentication**: Spotify OAuth 2.0
- **Database**: MongoDB (for saving playlists)
- **Deployment**: Vercel

## 🎯 How It Works

1. **Login**: Authenticate with your Spotify account
2. **Choose Mood**: Select from 5 carefully curated mood options
3. **Generate**: Our algorithm searches for tracks that match your mood
4. **Enjoy**: Your personalized playlist is instantly created in Spotify

## 🛠️ Environment Variables

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=your_redirect_uri
NEXTAUTH_URL=your_app_url
NEXTAUTH_SECRET=your_nextauth_secret
MONGODB_URI=your_mongodb_connection_string
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## 📱 Live Demo

Visit: [https://moody-your-vibe-your-playlist.vercel.app](https://moody-your-vibe-your-playlist.vercel.app)

## 🎨 Moods Available

- **😊 Happy**: Upbeat, feel-good tracks
- **😢 Sad**: Emotional, melancholic songs
- **⚡ Energetic**: High-energy workout music
- **😌 Chill**: Relaxing, ambient vibes
- **💕 Romantic**: Love songs and ballads

## 🔧 Development

The app uses a reliable search-based approach for playlist generation, ensuring consistent results across different Spotify accounts and regions.

## 📄 License

MIT License - feel free to use this project for your own purposes!
