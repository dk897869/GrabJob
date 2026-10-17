const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./env');

// Ensure reliable DNS resolution for MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn(`[Database Warning] If MongoDB is not running locally, starting in offline/in-memory mode or check MONGO_URI in .env`);
    // Do not terminate process in dev so mock-friendly endpoints and tests can function
    return null;
  }
};

module.exports = connectDB;
