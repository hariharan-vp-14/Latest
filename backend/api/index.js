const app = require('../app');
const connectToDb = require('../db/db');

module.exports = async (req, res) => {
  try {
    await connectToDb();
  } catch (err) {
    console.error('DB connection failed:', err);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed'
    });
  }

  return app(req, res);
};
