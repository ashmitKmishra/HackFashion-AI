#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting HackFashion-AI Applications${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get the root directory
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Function to run npm install and dev
run_app() {
    local app_dir=$1
    local app_name=$2
    
    echo -e "${YELLOW}→ Setting up ${app_name}...${NC}"
    cd "$app_dir"
    
    echo -e "${GREEN}  Installing dependencies in ${app_name}...${NC}"
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}  ✓ Dependencies installed for ${app_name}${NC}\n"
    else
        echo -e "${RED}  ✗ Failed to install dependencies for ${app_name}${NC}\n"
        return 1
    fi
}

# Install dependencies for main app
run_app "$ROOT_DIR" "Main App"

# Install dependencies for AI Wardrobe Stylist
run_app "$ROOT_DIR/Ashar/ai-wardrobe-stylist" "AI Wardrobe Stylist"

# Ensure file storage server dependencies are installed
echo -e "${YELLOW}→ Checking File Storage Server dependencies...${NC}"
cd "$ROOT_DIR/Ashar/ai-wardrobe-stylist"

# Check if required packages are installed
if ! npm list @google/genai >/dev/null 2>&1 || ! npm list express >/dev/null 2>&1 || ! npm list cors >/dev/null 2>&1 || ! npm list dotenv >/dev/null 2>&1; then
    echo -e "${GREEN}  Installing file storage dependencies...${NC}"
    npm install @google/genai express cors dotenv
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}  ✓ File storage dependencies installed${NC}\n"
    else
        echo -e "${RED}  ✗ Failed to install file storage dependencies${NC}\n"
        exit 1
    fi
else
    echo -e "${GREEN}  ✓ File storage dependencies already installed${NC}\n"
fi

# Check if .env file exists for Gemini API
if [ ! -f "$ROOT_DIR/Ashar/ai-wardrobe-stylist/.env" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found for Gemini API${NC}"
    echo -e "${YELLOW}   Please ensure GEMINI_API_KEY is set in .env file${NC}\n"
else
    echo -e "${GREEN}  ✓ .env file found${NC}\n"
fi

# Start all servers
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting Development Servers${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Starting File Storage Server on http://localhost:3001${NC}"
echo -e "${GREEN}Starting AI Wardrobe Stylist on http://localhost:5174${NC}"
echo -e "${GREEN}Starting Main App on http://localhost:3000${NC}\n"

# Start File Storage Server first (required by AI Wardrobe Stylist)
cd "$ROOT_DIR/Ashar/ai-wardrobe-stylist"
echo -e "${YELLOW}→ Starting File Storage Server...${NC}"
node fileStorageServer.js &
STORAGE_PID=$!

# Wait for the storage server to start
sleep 3

# Start AI Wardrobe Stylist
echo -e "${YELLOW}→ Starting AI Wardrobe Stylist...${NC}"
npm run dev &
AI_PID=$!

# Wait a moment
sleep 2

# Start main app
cd "$ROOT_DIR"
echo -e "${YELLOW}→ Starting Main App...${NC}"
npm run dev &
MAIN_PID=$!

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}All applications are running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Main App PID: $MAIN_PID"
echo -e "File Storage Server PID: $STORAGE_PID"
echo -e "AI Wardrobe Stylist PID: $AI_PID"
echo -e "\n${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all servers...${NC}"
    kill $MAIN_PID 2>/dev/null
    kill $STORAGE_PID 2>/dev/null
    kill $AI_PID 2>/dev/null
    echo -e "${GREEN}All servers stopped.${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
