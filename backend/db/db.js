const mongoose = require('mongoose');

function connectToDb() {
  return mongoose.connect(process.env.DB_CONNECT);
}

module.exports = connectToDb;
