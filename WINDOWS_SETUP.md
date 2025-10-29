# 🚀 Windows Setup Guide - Gesture Bridge ASL

This guide will help you set up the Gesture Bridge ASL application on Windows after pulling from Git.

## 📋 Prerequisites

Before running the setup, make sure you have the following installed:

### Required Software

1. **Python 3.8+** 
   - Download from: https://python.org/downloads/
   - ⚠️ **IMPORTANT**: Check "Add Python to PATH" during installation
   - Verify installation: Open Command Prompt and run `python --version`

2. **Node.js 16+**
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Verify installation: Open Command Prompt and run `node --version`

3. **Git** (if not already installed)
   - Download from: https://git-scm.com/download/win
   - Use default settings during installation

### Optional (for full functionality)
4. **MongoDB** (for database features)
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud) for easier setup

## 🔧 Quick Setup (Automated)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd gesture-bridge-asl
```

### Step 2: Run the Setup Script
Simply double-click the `start-dev.bat` file or run it from Command Prompt:

```cmd
start-dev.bat
```

The script will automatically:
- ✅ Check if Python and Node.js are installed
- ✅ Create Python virtual environment
- ✅ Install all Python dependencies
- ✅ Install all Node.js dependencies  
- ✅ Create environment configuration files
- ✅ Start all three services (Python API, Node.js API, React Frontend)
- ✅ Display service URLs and helpful information

### Step 3: Access the Application
Once the setup completes, open your browser and go to:
- **Main App**: http://localhost:5173
- **Sign School**: http://localhost:5173/sign-school
- **Pose Explorer**: http://localhost:5173/poses
- **Live Translation**: http://localhost:5173/translate

## 🛠️ Manual Setup (If Automated Setup Fails)

### 1. Set up Python API
```cmd
cd asl-recognition-api
python -m venv asl_env
asl_env\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 2. Set up Node.js API (in new terminal)
```cmd
cd asl-node-api
copy .env.example .env
npm install
npm start
```

### 3. Set up React Frontend (in new terminal)
```cmd
cd gesture-bridge-hub
npm install
npm run dev
```

## 🔧 Configuration

### Environment Files
The setup script automatically creates these files:

**asl-node-api/.env**:
```env
PORT=4000
JWT_SECRET=your-secret-key
PREDICTOR_URL=http://localhost:5001
DATABASE_FILE=./data/asl.db
```

**gesture-bridge-hub/.env**:
```env
VITE_API_URL=http://localhost:4000
```

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| React Frontend | http://localhost:5173 | Main application interface |
| Node.js API | http://localhost:4000 | Backend API and authentication |
| Python ML API | http://localhost:5001 | Machine learning predictions |

## 🎯 Features Available

### 📚 Sign School
- **Interactive Lessons**: 10+ comprehensive ASL lessons
- **3D Visualizations**: Interactive hand pose models
- **Progress Tracking**: Monitor your learning journey
- **Structured Curriculum**: Beginner to Advanced progression

### 🤟 Pose Explorer  
- **Sign Database**: 500+ ASL signs with detailed information
- **3D Viewer**: Interactive 3D hand pose visualization
- **Search & Filter**: Find signs by category, difficulty, or keyword
- **Detailed Instructions**: Step-by-step signing guides

### 🎥 Live Translation
- **Real-time Recognition**: Camera-based sign recognition
- **Translation History**: Save and review translations
- **Batch Processing**: Upload multiple images for recognition

## 🔍 Troubleshooting

### Common Issues

**1. "Python is not recognized"**
- Reinstall Python and check "Add Python to PATH"
- Or manually add Python to your system PATH

**2. "Node is not recognized"**  
- Reinstall Node.js from nodejs.org
- Restart Command Prompt after installation

**3. Port Already in Use**
- Close any existing instances of the applications
- Or change ports in the environment files

**4. Dependencies Installation Fails**
- Run Command Prompt as Administrator
- Clear npm cache: `npm cache clean --force`
- Delete node_modules folders and reinstall

**5. Python Virtual Environment Issues**
- Delete the `asl_env` folder and let the script recreate it
- Ensure you have sufficient disk space

### Mock Data Mode
If the APIs fail to start, the application will automatically use mock data:
- ✅ All lessons and signs will still be available
- ✅ 3D visualizations will work normally  
- ✅ Search and filtering will function
- ❌ Real ML predictions won't work
- ❌ User authentication will be limited

## 🚀 Development Tips

### Hot Reload
- React frontend automatically reloads on file changes
- Node.js API restarts automatically with nodemon
- Python API may need manual restart for changes

### Debugging
- Check browser console (F12) for frontend errors
- Check terminal windows for API errors
- All services log their status and errors

### Adding New Features
1. Frontend changes: Edit files in `gesture-bridge-hub/src/`
2. Backend changes: Edit files in `asl-node-api/`
3. ML changes: Edit files in `asl-recognition-api/`

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify all prerequisites are installed correctly
3. Try the manual setup process
4. Check the terminal/console for specific error messages

## 🎉 Success Indicators

You'll know the setup worked when you see:
- ✅ All three terminal windows running without errors
- ✅ React app loads at http://localhost:5173
- ✅ Sign School page shows lessons with images
- ✅ Pose Explorer shows 3D hand models
- ✅ No red error messages in browser console

Happy learning ASL! 🤟📚