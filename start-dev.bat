@echo off
echo 🚀 Starting Gesture Bridge Development Environment
echo ==================================================

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo ❌ MongoDB is not running. Please start MongoDB first:
    echo    net start MongoDB
    pause
    exit /b 1
)

echo ✅ MongoDB is running

echo.
echo 🐍 Starting Python Prediction API...
cd asl-recognition-api
if not exist "asl_env" (
    echo Creating Python virtual environment...
    python -m venv asl_env
)

call asl_env\Scripts\activate.bat
pip install -r requirements.txt >nul 2>&1
start /B python app.py
cd ..

echo ⏳ Waiting for Python API to start...
timeout /t 5 /nobreak >nul

echo.
echo 🟢 Starting Node.js Backend...
cd asl-node-api
call npm install >nul 2>&1
start /B npm start
cd ..

echo ⏳ Waiting for Node.js API to start...
timeout /t 3 /nobreak >nul

echo.
echo ⚛️  Starting React Frontend...
cd gesture-bridge-hub
call npm install >nul 2>&1
start /B npm run dev
cd ..

echo.
echo 🎉 All services started successfully!
echo ==================================================
echo 📱 Frontend:     http://localhost:5173
echo 🟢 Node.js API:  http://localhost:4000
echo 🐍 Python API:   http://localhost:5001
echo 🍃 MongoDB:      mongodb://localhost:27017
echo.
echo Press any key to stop all services...
pause >nul

echo.
echo 🛑 Stopping all services...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
echo ✅ All services stopped