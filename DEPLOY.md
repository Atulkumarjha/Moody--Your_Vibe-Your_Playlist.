# Quick Deployment Commands

## 1. Update Local Environment (if needed)
```bash
# Make sure your .env.local has all required variables
SPOTIFY_CLIENT_ID=1ed4574fefe145d7a4b4a325c20bf432
SPOTIFY_CLIENT_SECRET=aaf9d63af7e84cc7932f502a1f0fa583
SPOTIFY_REDIRECT_URI=https://moody-your-vibe-your-playlist.vercel.app/api/auth/callback
NEXTAUTH_URL=https://moody-your-vibe-your-playlist.vercel.app
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key-here
MONGODB_URI=mongodb+srv://atul:12345@moody.nz4fpar.mongodb.net/?retryWrites=true&w=majority&appName=MOODY
```

## 2. Deploy to Vercel
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Deploy
vercel --prod

# Or if you prefer, push to git and let Vercel auto-deploy
git add .
git commit -m "Fix playlist generation - switch to search-based method"
git push origin main
```

## 3. Set Environment Variables in Vercel (if not set)
```bash
# Using Vercel CLI
vercel env add NEXTAUTH_URL
# Enter: https://moody-your-vibe-your-playlist.vercel.app

vercel env add NEXTAUTH_SECRET  
# Enter: your-generated-secret-here

# Or use the Vercel dashboard:
# https://vercel.com/dashboard -> your-project -> Settings -> Environment Variables
```

## 4. Test After Deployment
Visit these URLs after deployment:
- Main app: https://moody-your-vibe-your-playlist.vercel.app
- Simple test: https://moody-your-vibe-your-playlist.vercel.app/simple-test.html
- Setup test: https://moody-your-vibe-your-playlist.vercel.app/setup-test.html

## 5. Generate NEXTAUTH_SECRET
```bash
# On Windows PowerShell:
[System.Web.Security.Membership]::GeneratePassword(32, 0)

# On Git Bash or WSL:
openssl rand -base64 32

# Online generator:
# https://generate-secret.vercel.app/32
```

## What Changed
- ✅ Dashboard now uses `/api/create-playlist-simple` (search-based) instead of `/api/create-playlist` (recommendations)
- ✅ Added comprehensive test pages
- ✅ Updated environment variable documentation
- ✅ The search-based method is more reliable and doesn't depend on Spotify's recommendations API quirks
