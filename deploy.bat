@echo off
REM Deployment script for Moody Playlist Generator

echo 🚀 Starting deployment process...

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ .env.local file not found!
    echo Please create .env.local with your Spotify credentials:
    echo SPOTIFY_CLIENT_ID=your_client_id
    echo SPOTIFY_CLIENT_SECRET=your_client_secret
    echo SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
    echo NEXTAUTH_URL=http://localhost:3000
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Build the project
echo 🔨 Building the project...
call npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo 🎉 Ready to deploy!
    echo.
    echo To start the production server:
    echo npm start
    echo.
    echo To start development server:
    echo npm run dev
) else (
    echo ❌ Build failed!
    exit /b 1
)
