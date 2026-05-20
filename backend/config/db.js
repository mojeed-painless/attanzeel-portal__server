// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  try {
    if (!mongoUri) {
      throw new Error('MONGO_URI is not configured');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);

    if (process.env.NODE_ENV === 'development') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();

        const conn = await mongoose.connect(memoryUri);

        console.warn('Connected to in-memory MongoDB for development fallback.');
        console.warn('Data will not persist after process restarts.');
        return conn;
      } catch (memoryError) {
        console.error(`MongoDB memory fallback failed: ${memoryError.message}`);
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;