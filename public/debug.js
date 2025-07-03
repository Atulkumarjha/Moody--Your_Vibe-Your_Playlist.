// Debug script to test API endpoints
console.log('🔍 Starting debug script...');

// Test 1: Check if API test endpoint works
fetch('/api/test')
  .then(res => res.json())
  .then(data => console.log('✅ API test:', data))
  .catch(err => console.error('❌ API test failed:', err));

// Test 2: Check token endpoint
fetch('/api/token')
  .then(res => res.json())
  .then(data => console.log('✅ Token check:', data))
  .catch(err => console.error('❌ Token check failed:', err));

// Test 3: Check user profile (if token exists)
setTimeout(() => {
  fetch('/api/token')
    .then(res => res.json())
    .then(tokenData => {
      if (tokenData.access_token) {
        console.log('✅ Access token found, testing user profile...');
        fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        })
          .then(res => res.json())
          .then(userData => console.log('✅ User profile:', userData))
          .catch(err => console.error('❌ User profile failed:', err));
      } else {
        console.log('⚠️ No access token found - please log in first');
      }
    });
}, 1000);

// Test 4: Check available genres
setTimeout(() => {
  fetch('/api/token')
    .then(res => res.json())
    .then(tokenData => {
      if (tokenData.access_token) {
        console.log('✅ Testing available genres...');
        fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        })
          .then(res => res.json())
          .then(genreData => {
            console.log('✅ Available genres:', genreData.genres);
            console.log('🎵 Our moods use these genres:');
            console.log('Happy:', ['pop', 'dance', 'funk', 'disco', 'happy']);
            console.log('Sad:', ['acoustic', 'piano', 'chill', 'indie', 'ambient']);
            console.log('Energetic:', ['work-out', 'rock', 'techno', 'electronic', 'punk']);
            console.log('Chill:', ['chill', 'ambient', 'downtempo', 'study', 'sleep']);
            console.log('Romantic:', ['romance', 'r-n-b', 'soul', 'jazz', 'bossanova']);
          })
          .catch(err => console.error('❌ Genre check failed:', err));
      }
    });
}, 2000);

console.log('🔍 Debug script loaded. Check console for results.');
