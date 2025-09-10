#!/bin/bash

# ThemeBotPark Deployment Script
echo "🚀 Deploying ThemeBotPark to production..."

# Build the application
echo "📦 Building production version..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo "🎉 Deployment complete!"
echo "Visit your live application at the URL provided above."
