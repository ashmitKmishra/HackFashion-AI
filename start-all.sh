#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# Start both servers
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting Development Servers${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Starting Main App on http://localhost:3000${NC}"
echo -e "${GREEN}Starting AI Wardrobe Stylist on http://localhost:5173${NC}\n"

# Start main app in background
cd "$ROOT_DIR"
npm run dev &
MAIN_PID=$!

# Wait a moment for the first server to start
sleep 2

# Start AI Wardrobe Stylist in background
cd "$ROOT_DIR/Ashar/ai-wardrobe-stylist"
npm run dev &
AI_PID=$!

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Both applications are running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Main App PID: $MAIN_PID"
echo -e "AI Wardrobe Stylist PID: $AI_PID"
echo -e "\n${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping all servers...${NC}"
    kill $MAIN_PID 2>/dev/null
    kill $AI_PID 2>/dev/null
    echo -e "${GREEN}All servers stopped.${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
