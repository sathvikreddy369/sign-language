# 🤟 Gesture Bridge - ASL Learning Platform

A comprehensive American Sign Language (ASL) learning platform with interactive 3D visualizations, structured lessons, and real-time sign recognition.

## 🚀 Quick Start (Windows)

### Option 1: Automated Setup (Recommended)
1. **Check Prerequisites**: Double-click `check-setup.bat` to verify your system
2. **Start Application**: Double-click `start-dev.bat` to launch all services
3. **Open Browser**: Go to http://localhost:5173

### Option 2: Manual Setup
See [WINDOWS_SETUP.md](WINDOWS_SETUP.md) for detailed instructions.

## 📱 Features

### 🎓 Sign School
- **10+ Interactive Lessons**: From alphabet basics to complex conversations
- **3D Hand Models**: Realistic hand pose visualizations  
- **Progress Tracking**: Monitor your learning journey
- **Structured Curriculum**: Beginner → Intermediate → Advanced

### 🔍 Pose Explorer
- **500+ ASL Signs**: Comprehensive sign database
- **Interactive 3D Viewer**: Rotate and examine hand poses
- **Smart Search**: Find signs by category, difficulty, or keyword
- **Detailed Instructions**: Step-by-step signing guides with tips

### 🎥 Live Translation
- **Real-time Recognition**: Camera-based sign detection
- **Translation History**: Save and review your translations
- **Batch Processing**: Upload multiple images for analysis

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + SQLite
- **ML API**: Python + Flask + TensorFlow
- **3D Graphics**: Three.js + React Three Fiber
- **UI Components**: Tailwind CSS + Radix UI

## 📁 Project Structure

```
gesture-bridge-asl/
├── 📱 gesture-bridge-hub/     # React frontend application
├── 🟢 asl-node-api/          # Node.js backend API
├── 🐍 asl-recognition-api/   # Python ML prediction service
├── 🚀 start-dev.bat          # Windows setup script
├── 🔍 check-setup.bat        # System requirements checker
└── 📖 WINDOWS_SETUP.md       # Detailed setup guide
```

## 🌐 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| 📱 Frontend | http://localhost:5173 | Main application |
| 🟢 Node.js API | http://localhost:4000 | Backend services |
| 🐍 Python ML API | http://localhost:5001 | Sign recognition |

## 🎯 Key Features

### Educational Content
- ✅ Comprehensive ASL curriculum
- ✅ Interactive 3D hand models
- ✅ Progress tracking and achievements
- ✅ Cultural context and tips
- ✅ Common mistakes guidance

### Technical Features  
- ✅ Real-time sign recognition
- ✅ Responsive design (mobile-friendly)
- ✅ Offline-capable with mock data
- ✅ Modern UI with dark mode
- ✅ Accessibility compliant

## 🔧 Development

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git (recommended)

### Environment Setup
The setup script automatically creates:
- `asl-node-api/.env` - Backend configuration
- `gesture-bridge-hub/.env` - Frontend configuration

### Hot Reload
- React frontend: Automatic reload on changes
- Node.js API: Auto-restart with nodemon
- Python API: Manual restart required

## 🐛 Troubleshooting

### Common Issues
1. **Port conflicts**: Close existing applications or change ports
2. **Python/Node not found**: Ensure they're installed and in PATH
3. **Dependencies fail**: Run as Administrator or clear caches
4. **Services won't start**: Check the terminal output for specific errors

### Mock Data Mode
If APIs fail, the app automatically uses mock data:
- ✅ All lessons and signs available
- ✅ 3D visualizations work
- ❌ Real ML predictions disabled

## 📚 Learning Path

### Beginner (Start Here)
1. **ASL Alphabet** - Master fingerspelling
2. **Basic Greetings** - Essential polite expressions  
3. **Numbers 1-10** - Counting and basic math

### Intermediate
4. **Family Members** - Relationship terms
5. **Colors** - Descriptive vocabulary
6. **Common Animals** - Everyday creatures
7. **Daily Actions** - Routine activities

### Advanced
8. **Emotions & Feelings** - Express complex emotions
9. **Time Concepts** - Scheduling and temporal ideas
10. **Common Phrases** - Conversational expressions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- ASL community for cultural guidance
- Open source contributors
- Educational institutions supporting ASL learning

---

**Ready to start learning ASL?** 🤟

Run `check-setup.bat` to verify your system, then `start-dev.bat` to launch the application!