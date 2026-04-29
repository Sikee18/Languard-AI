import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import applicationRoutes from './routes/applicationRoutes.js';
import ocrRoutes from './routes/ocrRoutes.js';
import satelliteRoutes from './routes/satelliteRoutes.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/applications', applicationRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/satellite', satelliteRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('LandGuard AI Backend is Running 🚀');
});

// Database Connection
const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    // For competition/hackathon easy setup: if connection string is local, use in-memory db
    if (!MONGODB_URI || MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
      console.log('⚠️ Local MongoDB connection string detected. Starting In-Memory MongoDB for zero-setup execution...');
      const mongoServer = await MongoMemoryServer.create();
      MONGODB_URI = mongoServer.getUri();
      console.log(`✅ In-Memory MongoDB started at ${MONGODB_URI}`);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

startServer();
