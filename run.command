#!/bin/bash

# Portfolio Project Runner
# This script will automatically run the Next.js portfolio project in a new terminal

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Change to the project directory
cd "$SCRIPT_DIR"

echo "🚀 Starting Portfolio Project..."
echo "Project directory: $SCRIPT_DIR"

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Starting development server..."
echo "Opening http://localhost:3000 in your browser..."

# Start the development server
npm run dev

# Keep the terminal open after the script finishes
echo "Press any key to close this terminal..."
read -n 1