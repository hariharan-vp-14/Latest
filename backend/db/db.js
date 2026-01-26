const mongoose = require('mongoose');

let cached = global.__mongooseCached;

if (!cached) {
  cached = global.__mongooseCached = { conn: null, promise: null };
}

async function connectToDb() {
  if (cached.conn) return cached.conn;
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.DB_CONNECT;
    if (!uri) {
      throw new Error('Missing DB_CONNECT environment variable');
    }

    cached.promise = mongoose.connect(uri).then(() => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectToDb;
