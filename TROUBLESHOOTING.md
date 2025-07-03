# 🚨 TROUBLESHOOTING: Playlist Generation Error

## Common Issues and Solutions

### 1. Environment Variables Missing
**Problem**: "Access token missing" error
**Solution**: 
1. Create `.env.local` file in the root directory
2. Add your Spotify credentials:
```
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXTAUTH_URL=http://localhost:3000
```

### 2. Spotify App Not Set Up
**Problem**: Authentication fails
**Solution**:
1. Go to https://developer.spotify.com/dashboard
2. Create a new app
3. Add `http://localhost:3000/api/auth/callback` to Redirect URIs
4. Copy Client ID and Client Secret to `.env.local`

### 3. Not Logged In
**Problem**: "Access token missing" error
**Solution**:
1. Visit http://localhost:3000
2. Click "Connect with Spotify"
3. Complete the authentication flow

### 4. Invalid Genres
**Problem**: "No tracks found for this mood" error
**Solution**: The app now uses validated Spotify genres

### 5. Spotify Premium Required
**Problem**: Some API calls may fail
**Solution**: Ensure you have Spotify Premium (recommended)

## Testing Steps

1. **Check API Status**:
   Visit: http://localhost:3000/api/test

2. **Check Authentication**:
   Visit: http://localhost:3000/api/token

3. **Test Playlist Creation**:
   ```javascript
   // Open browser console and run:
   fetch('/api/create-playlist', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ mood: 'happy' })
   }).then(r => r.json()).then(console.log)
   ```

## Debug Script
Load the debug script by adding this to your browser console:
```javascript
const script = document.createElement('script');
script.src = '/debug.js';
document.head.appendChild(script);
```

## Contact Support
If issues persist, check the browser console and server logs for specific error messages.
