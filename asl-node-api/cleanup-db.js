require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/signlang';

async function cleanup() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Drop the users collection to start fresh
        await mongoose.connection.db.collection('users').drop();
        console.log('Dropped users collection');
        
        // Drop the predictionlogs collection too
        try {
            await mongoose.connection.db.collection('predictionlogs').drop();
            console.log('Dropped predictionlogs collection');
        } catch (err) {
            console.log('predictionlogs collection does not exist');
        }
        
        console.log('Database cleanup complete');
        process.exit(0);
    } catch (error) {
        console.error('Cleanup error:', error);
        process.exit(1);
    }
}

cleanup();