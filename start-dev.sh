#!/bin/bash

# Gesture Bridge Development Startup Script

echo "🚀 Starting Gesture Bridge Development Environment"
echo "=================================================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first:"
    echo "   macOS: brew services start mongodb-community"
    echo "   Ubuntu: sudo systemctl start mongod"
    echo "   Windows: net start MongoDB"
    exit 1
fi

echo "✅ MongoDB is running"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check required ports
check_port 4000 || exit 1  # Node.js API
check_port 5001 || exit 1  # Python API
check_port 5173 || exit 1  # Frontend

echo ""
echo "🐍 Starting Python Prediction API..."
cd asl-recognition-api
if [ ! -d "asl_env" ]; then
    echo "Creating Python virtual environment..."
    python -m venv asl_env
fi

source asl_env/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
python app.py &
PYTHON_PID=$!
cd ..

echo "⏳ Waiting for Python API to start..."
sleep 5

echo ""
echo "🟢 Starting Node.js Backend..."
cd asl-node-api
npm install > /dev/null 2>&1
npm start &
NODE_PID=$!
cd ..

echo "⏳ Waiting for Node.js API to start..."
sleep 3

echo ""
echo "⚛️  Starting React Frontend..."
cd gesture-bridge-hub
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 All services started successfully!"
echo "=================================================="
echo "📱 Frontend:     http://localhost:5173"
echo "🟢 Node.js API:  http://localhost:4000"
echo "🐍 Python API:   http://localhost:5001"
echo "🍃 MongoDB:      mongodb://localhost:27017"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $PYTHON_PID 2>/dev/null
    kill $NODE_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait