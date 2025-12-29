const http = require('http');
const app = require('./app')
const connectToDb = require('./db/db');
const port = process.env.PORT || 3000;

(async () => {
  try {
    await connectToDb();
    console.log('Connected to DB');
  } catch (err) {
    console.error('DB connection failed', err.message);
    process.exit(1);
  }

  const server = http.createServer(app);

  server.listen(port,() => {
    console.log(`Server is running in port ${port}`);
  });
})();

