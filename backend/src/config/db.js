const mongoose = require('mongoose');
const dns = require('dns');
const env = require('./env');

// Ensure reliable DNS resolution for MongoDB Atlas SRV records on Windows only
// On Linux/Cloud (Render, Vercel, Docker), native container DNS should be preserved
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {}
}

// Disable buffering so unhandled database queries don't hang for 10s and crash cron tasks
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uri = env.MONGO_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>') || uri.includes('cluster.mongodb.net')) {
    console.warn(`[Database Warning] MONGO_URI appears to contain placeholder credentials or is not set in Render Environment Variables.`);
    console.warn(`[Database Action Required] Go to Render Dashboard -> Environment -> Add MONGO_URI with your MongoDB Atlas connection string.`);
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.warn(`[Database Warning] Check MONGO_URI in Render Environment Variables or ensure MongoDB Atlas Network Access allows 0.0.0.0/0.`);
    return null;
  }
};

module.exports = connectDB;
