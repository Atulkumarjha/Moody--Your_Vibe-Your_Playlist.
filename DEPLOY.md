# Deployment Guide

## Environment Variables Required

Make sure your `.env.local` has these variables:
```bash
SPOTIFY_CLIENT_ID=1ed4574fefe145d7a4b4a325c20bf432
SPOTIFY_CLIENT_SECRET=aaf9d63af7e84cc7932f502a1f0fa583
SPOTIFY_REDIRECT_URI=https://moody-your-vibe-your-playlist.vercel.app/api/auth/callback
NEXTAUTH_URL=https://moody-your-vibe-your-playlist.vercel.app
NEXTAUTH_SECRET=PLKbAFOvMPOnn4tL3TcsX/Hubibe2SsQBh2rIn6Wr5w=
MONGODB_URI=mongodb+srv://atul:12345@moody.nz4fpar.mongodb.net/?retryWrites=true&w=majority&appName=MOODY
```

## Deploy to Vercel

### Option 1: Git Push (Recommended)
```bash
git add .
git commit -m "Update"
git push origin main
```

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

## Important Notes
- ✅ App uses reliable search-based playlist generation
- ✅ All environment variables must be set in Vercel dashboard
- ✅ Remember to redeploy after changing environment variables
