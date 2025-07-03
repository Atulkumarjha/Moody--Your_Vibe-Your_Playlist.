@echo off
title Moody Playlist Generator - Development Server

echo.
echo ╔═══════════════════════════════════════════════════════════════════╗
echo ║                    Moody Playlist Generator                       ║
echo ║                   Development Server Starting                     ║
echo ╚═══════════════════════════════════════════════════════════════════╝
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ .env.local file not found!
    echo.
    echo Please create .env.local with your Spotify credentials:
    echo SPOTIFY_CLIENT_ID=your_client_id
    echo SPOTIFY_CLIENT_SECRET=your_client_secret
    echo SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
    echo NEXTAUTH_URL=http://localhost:3000
    echo.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

echo 🚀 Starting development server...
echo 📱 Open http://localhost:3000 in your browser
echo 🔄 Press Ctrl+C to stop the server
echo.

call npm run dev
