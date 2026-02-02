const mongoose = require("mongoose");

// Global cache for Vercel (serverless safe)
let cached = global.__mongooseCache;

if (!cached) {
  cached = global.__mongooseCache = {
    conn: null,
    promise: null,
  };
}

async function connectToDb() {
  // If already connected, return
  if (cached.conn) {
    return cached.conn;
  }

  // If mongoose is already connected
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return cached.conn;
  }

  // Read environment variable
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ MONGODB_URI is not defined in environment variables");
  }

  // Create new connection if not exists
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }

  return cached.conn;
}

module.exports = connectToDb;
