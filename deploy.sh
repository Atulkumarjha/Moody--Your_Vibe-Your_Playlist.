#!/bin/bash
# Deployment script for Moody Playlist Generator

echo "🚀 Starting deployment process..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your Spotify credentials:"
    echo "SPOTIFY_CLIENT_ID=your_client_id"
    echo "SPOTIFY_CLIENT_SECRET=your_client_secret"
    echo "SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback"
    echo "NEXTAUTH_URL=http://localhost:3000"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🎉 Ready to deploy!"
    echo ""
    echo "To start the production server:"
    echo "npm start"
    echo ""
    echo "To start development server:"
    echo "npm run dev"
else
    echo "❌ Build failed!"
    exit 1
fi
