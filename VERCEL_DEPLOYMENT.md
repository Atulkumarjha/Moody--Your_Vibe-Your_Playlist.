# Vercel Deployment Guide

## Environment Variables Setup for Vercel

To deploy your mood playlist generator to Vercel successfully, you need to set up the following environment variables in your Vercel dashboard:

### 1. Go to your Vercel project dashboard
- Visit https://vercel.com/dashboard
- Select your `moody-your-vibe-your-playlist` project
- Go to Settings → Environment Variables

### 2. Add the following environment variables:

```
SPOTIFY_CLIENT_ID=1ed4574fefe145d7a4b4a325c20bf432
SPOTIFY_CLIENT_SECRET=aaf9d63af7e84cc7932f502a1f0fa583
SPOTIFY_REDIRECT_URI=https://moody-your-vibe-your-playlist.vercel.app/api/auth/callback
NEXTAUTH_URL=https://moody-your-vibe-your-playlist.vercel.app
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key-here
MONGODB_URI=mongodb+srv://atul:12345@moody.nz4fpar.mongodb.net/?retryWrites=true&w=majority&appName=MOODY
```

### 3. Important Notes:

#### NEXTAUTH_SECRET
- Generate a secure random string for production
- You can use: `openssl rand -base64 32` or an online generator
- This must be different from your local development secret

#### SPOTIFY_REDIRECT_URI
- Must match exactly what you've configured in your Spotify app dashboard
- Should be: `https://moody-your-vibe-your-playlist.vercel.app/api/auth/callback`

#### NEXTAUTH_URL
- Must match your actual Vercel deployment URL
- Should be: `https://moody-your-vibe-your-playlist.vercel.app`

### 4. After adding environment variables:
1. Redeploy your application (this is crucial!)
2. In Vercel dashboard, go to Deployments
3. Click the three dots (⋯) on your latest deployment
4. Click "Redeploy"

### 5. Spotify App Configuration
Make sure your Spotify app (https://developer.spotify.com/dashboard) has:
- Redirect URI: `https://moody-your-vibe-your-playlist.vercel.app/api/auth/callback`
- Web API scope enabled

### 6. Testing
After redeployment:
1. Visit your live app: https://moody-your-vibe-your-playlist.vercel.app
2. Try the test page: https://moody-your-vibe-your-playlist.vercel.app/setup-test.html
3. Test both authentication and playlist generation

### 7. Debugging Production Issues
If you still encounter issues:
1. Check Vercel Functions logs in your dashboard
2. Use the `/api/test` endpoint to verify basic functionality
3. Use the `/api/validate-genres` endpoint to check genre availability
4. Try the simplified playlist generation at `/api/create-playlist-simple`

### 8. Common Issues and Solutions

#### "Failed to fetch recommendations"
- Usually caused by missing or incorrect environment variables
- Verify all environment variables are set correctly in Vercel
- Ensure you've redeployed after adding/changing environment variables

#### Authentication issues
- Check that `NEXTAUTH_URL` matches your deployment URL exactly
- Verify `NEXTAUTH_SECRET` is set to a secure value
- Confirm Spotify redirect URI matches in both Spotify dashboard and environment variables

#### Database connection issues
- Verify `MONGODB_URI` is correct and accessible from Vercel's infrastructure
- Check MongoDB Atlas network access settings allow connections from anywhere (0.0.0.0/0)
