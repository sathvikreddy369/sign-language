# Gesture Bridge Setup Guide

This guide will help you set up and run the Gesture Bridge application with all components working together.

## Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- MongoDB installed and running locally
- Git installed

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 2. Start the Python Prediction API
```bash
cd asl-recognition-api

# Create virtual environment (first time only)
python -m venv asl_env

# Activate virtual environment
# On Windows:
.\asl_env\Scripts\activate
# On macOS/Linux:
source asl_env/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the prediction server
python app.py
```
The Python API will run on http://localhost:5001

### 3. Start the Node.js Backend
```bash
cd asl-node-api

# Install dependencies (first time only)
npm install

# Start the Node.js server
npm start
```
The Node.js API will run on http://localhost:4000

### 4. Start the Frontend
```bash
cd gesture-bridge-hub

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```
The frontend will run on http://localhost:5173

## Configuration

### Environment Variables

**asl-node-api/.env:**
```
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PREDICTOR_URL=http://localhost:5001
MONGODB_URI=mongodb://127.0.0.1:27017/signlang
```

**gesture-bridge-hub/.env:**
```
VITE_API_URL=http://localhost:4000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Predictions
- `POST /api/predict` - Single image prediction
- `POST /api/predict-batch` - Batch image prediction
- `GET /api/labels` - Get available ASL labels

### Admin (requires admin role)
- `GET /api/users` - List all users
- `PATCH /api/users/:id` - Update user
- `GET /api/predictions` - View prediction logs
- `GET /api/stats/summary` - Dashboard statistics

### Health
- `GET /health` - API health check

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongosh` should connect successfully
- Check the connection string in `.env`
- Make sure the database name is correct

### Python API Issues
- Ensure the virtual environment is activated
- Check if all Python dependencies are installed
- Verify the model file `asl_mobilenetv2.h5` exists

### Frontend Connection Issues
- Check that `VITE_API_URL` points to the Node.js server (port 4000)
- Ensure CORS is properly configured
- Check browser console for detailed error messages

### Port Conflicts
- Node.js API: port 4000
- Python API: port 5001  
- Frontend: port 5173
- MongoDB: port 27017

Make sure these ports are available or update the configuration accordingly.

## First Time Setup

1. The first user to register will automatically become an admin
2. Admin users can manage other users and view system statistics
3. All users can use the translation features
4. Prediction logs are automatically saved for analytics

## Development

### Adding New Features
- Backend API: Add routes in `asl-node-api/server.js`
- Frontend: Add components in `gesture-bridge-hub/src/`
- Database: Add models in `asl-node-api/models/`

### Database Schema
- **users**: User accounts and authentication
- **predictionlogs**: ASL prediction history and analytics

## Production Deployment

For production deployment:
1. Use environment variables for all secrets
2. Set up proper MongoDB authentication
3. Use HTTPS for all connections
4. Configure proper CORS origins
5. Set up proper logging and monitoring