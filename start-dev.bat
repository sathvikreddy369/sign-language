@echo off
setlocal enabledelayedexpansion
title Gesture Bridge - ASL Development Environment

echo.
echo 🚀 GESTURE BRIDGE - ASL DEVELOPMENT ENVIRONMENT
echo ==================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo    Please install Python 3.8+ from https://python.org
    echo    Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo    Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Python and Node.js are available

REM Create environment files if they don't exist
if not exist "asl-node-api\.env" (
    echo � Cregating Node.js environment file...
    copy "asl-node-api\.env.example" "asl-node-api\.env" >nul
    echo    Created asl-node-api\.env from example
)

if not exist "gesture-bridge-hub\.env" (
    echo 📝 Creating React environment file...
    echo VITE_API_URL=http://localhost:4000 > "gesture-bridge-hub\.env"
    echo    Created gesture-bridge-hub\.env
)

echo.
echo 🐍 Setting up Python Prediction API...
cd asl-recognition-api

REM Create virtual environment if it doesn't exist
if not exist "asl_env" (
    echo    Creating Python virtual environment...
    python -m venv asl_env
    if %errorlevel% neq 0 (
        echo ❌ Failed to create virtual environment
        cd ..
        pause
        exit /b 1
    )
)

REM Activate virtual environment and install dependencies
echo    Activating virtual environment and installing dependencies...
call asl_env\Scripts\activate.bat
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    cd ..
    pause
    exit /b 1
)

echo    Starting Python API server...
start /B cmd /c "call asl_env\Scripts\activate.bat && python app.py"
cd ..

echo ⏳ Waiting for Python API to initialize...
timeout /t 8 /nobreak >nul

echo.
echo 🟢 Setting up Node.js Backend...
cd asl-node-api

echo    Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install Node.js dependencies
    cd ..
    pause
    exit /b 1
)

echo    Starting Node.js API server...
start /B cmd /c "npm start"
cd ..

echo ⏳ Waiting for Node.js API to initialize...
timeout /t 5 /nobreak >nul

echo.
echo ⚛️  Setting up React Frontend...
cd gesture-bridge-hub

echo    Installing React dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install React dependencies
    cd ..
    pause
    exit /b 1
)

echo    Starting React development server...
start /B cmd /c "npm run dev"
cd ..

echo ⏳ Waiting for React dev server to start...
timeout /t 8 /nobreak >nul

echo.
echo 🎉 ALL SERVICES STARTED SUCCESSFULLY!
echo ==================================================
echo.
echo 🌐 AVAILABLE SERVICES:
echo    📱 Frontend (React):     http://localhost:5173
echo    🟢 Node.js API:         http://localhost:4000  
echo    🐍 Python ML API:       http://localhost:5001
echo.
echo 📋 QUICK LINKS:
echo    • Sign School:           http://localhost:5173/sign-school
echo    • Pose Explorer:         http://localhost:5173/poses
echo    • Live Translation:      http://localhost:5173/translate
echo.
echo 💡 TIPS:
echo    • The app will work with mock data if APIs are unavailable
echo    • Check browser console for any connection issues
echo    • All services run in background - close this window to stop them
echo.
echo ⚠️  Press Ctrl+C or close this window to stop all services
echo ==================================================
echo.

REM Keep the window open and wait for user to close it
:wait_loop
timeout /t 30 /nobreak >nul
goto wait_loop