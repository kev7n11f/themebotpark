@echo off
REM ThemeBotPark Deployment Script for Windows

echo 🚀 Deploying ThemeBotPark to production...

REM Build the application
echo 📦 Building production version...
call npm run build

REM Check if build was successful
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build completed successfully!

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
call npx vercel --prod

echo 🎉 Deployment complete!
echo Visit your live application at the URL provided above.
