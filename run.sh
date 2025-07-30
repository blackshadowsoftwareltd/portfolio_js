#!/bin/bash

# Portfolio Project Runner
# This script will automatically run the Next.js portfolio project

echo "🚀 Starting Portfolio Project..."
echo "Installing dependencies..."

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Starting development server..."
npm run dev
