#!/bin/bash

# HealthNative Quick Start Script

echo "🏥 HealthNative - Healthcare Management App"
echo "==========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the health_native directory?"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Installation failed. Please check the errors above."
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "🚀 Starting development server..."
echo ""
echo "📱 How to run the app:"
echo "   1. Install Expo Go on your phone"
echo "   2. Scan the QR code that appears"
echo "   3. Or press 'a' for Android emulator"
echo "   4. Or press 'i' for iOS simulator"
echo "   5. Or press 'w' for web browser"
echo ""
echo "🔐 Demo Credentials:"
echo "   Admin: admin@health.com / password"
echo "   User:  user@health.com / password"
echo ""
echo "Starting Expo..."
echo ""

npm start
