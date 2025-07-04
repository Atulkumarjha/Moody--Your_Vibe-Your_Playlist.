# 🚀 Deployment Guide

## Quick Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### 2. Environment Variables
Set these in your Vercel dashboard (Settings → Environment Variables):

```env
SPOTIFY_CLIENT_ID=1ed4574fefe145d7a4b4a325c20bf432
SPOTIFY_CLIENT_SECRET=aaf9d63af7e84cc7932f502a1f0fa583
SPOTIFY_REDIRECT_URI=https://your-app.vercel.app/api/auth/callback
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secure-secret-here
MONGODB_URI=mongodb+srv://your-connection-string
```

### 3. Spotify App Configuration
In your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
- Add your production URL to Redirect URIs
- Example: `https://your-app.vercel.app/api/auth/callback`

### 4. Deploy
Vercel will automatically deploy when you push to GitHub.

## 🎯 Key Features
- ✅ Search-based playlist generation (more reliable)
- ✅ Clean, modern UI with smooth animations
- ✅ Responsive design for all devices
- ✅ Secure authentication with Spotify
- ✅ Fast playlist creation and navigation
