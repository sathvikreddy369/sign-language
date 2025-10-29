@echo off
title Gesture Bridge - Setup Checker

echo.
echo 🔍 GESTURE BRIDGE SETUP CHECKER
echo ==================================
echo.

echo Checking system requirements...
echo.

REM Check Python
echo [1/4] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
    echo ✅ Python !PYTHON_VERSION! is installed
) else (
    echo ❌ Python is NOT installed or not in PATH
    echo    Download from: https://python.org/downloads/
    echo    Make sure to check "Add Python to PATH"
)

echo.

REM Check Node.js
echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js !NODE_VERSION! is installed
) else (
    echo ❌ Node.js is NOT installed or not in PATH
    echo    Download from: https://nodejs.org/
)

echo.

REM Check npm
echo [3/4] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm !NPM_VERSION! is installed
) else (
    echo ❌ npm is NOT installed (should come with Node.js)
)

echo.

REM Check Git
echo [4/4] Checking Git installation...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=3" %%i in ('git --version') do set GIT_VERSION=%%i
    echo ✅ Git !GIT_VERSION! is installed
) else (
    echo ⚠️  Git is not installed (optional but recommended)
    echo    Download from: https://git-scm.com/download/win
)

echo.
echo ==================================

REM Check project structure
echo.
echo 📁 Checking project structure...
echo.

if exist "asl-recognition-api" (
    echo ✅ asl-recognition-api folder found
) else (
    echo ❌ asl-recognition-api folder missing
)

if exist "asl-node-api" (
    echo ✅ asl-node-api folder found
) else (
    echo ❌ asl-node-api folder missing
)

if exist "gesture-bridge-hub" (
    echo ✅ gesture-bridge-hub folder found
) else (
    echo ❌ gesture-bridge-hub folder missing
)

if exist "start-dev.bat" (
    echo ✅ start-dev.bat script found
) else (
    echo ❌ start-dev.bat script missing
)

echo.

REM Check requirements files
echo 📋 Checking dependency files...
echo.

if exist "asl-recognition-api\requirements.txt" (
    echo ✅ Python requirements.txt found
) else (
    echo ❌ Python requirements.txt missing
)

if exist "asl-node-api\package.json" (
    echo ✅ Node.js package.json found
) else (
    echo ❌ Node.js package.json missing
)

if exist "gesture-bridge-hub\package.json" (
    echo ✅ React package.json found
) else (
    echo ❌ React package.json missing
)

echo.
echo ==================================

REM Check ports
echo.
echo 🌐 Checking if ports are available...
echo.

netstat -an | find "5173" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5173 (React) is already in use
) else (
    echo ✅ Port 5173 (React) is available
)

netstat -an | find "4000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 4000 (Node.js) is already in use
) else (
    echo ✅ Port 4000 (Node.js) is available
)

netstat -an | find "5001" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 5001 (Python) is already in use
) else (
    echo ✅ Port 5001 (Python) is available
)

echo.
echo ==================================
echo.

echo 💡 RECOMMENDATIONS:
echo.

REM Check if all requirements are met
python --version >nul 2>&1
set PYTHON_OK=%errorlevel%

node --version >nul 2>&1  
set NODE_OK=%errorlevel%

if %PYTHON_OK% equ 0 if %NODE_OK% equ 0 (
    echo ✅ Your system is ready! You can run start-dev.bat
    echo.
    echo 🚀 To start the application:
    echo    1. Double-click start-dev.bat
    echo    2. Or run: start-dev.bat
    echo    3. Wait for all services to start
    echo    4. Open http://localhost:5173 in your browser
) else (
    echo ❌ Please install missing requirements first:
    if %PYTHON_OK% neq 0 (
        echo    • Install Python from https://python.org/downloads/
    )
    if %NODE_OK% neq 0 (
        echo    • Install Node.js from https://nodejs.org/
    )
    echo.
    echo    Then run this checker again to verify.
)

echo.
echo Press any key to exit...
pause >nul