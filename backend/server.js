const http = require('http');
const app = require('./app');
const connectToDb = require('./db/db');
const cron = require('node-cron');
require('dotenv').config();

const port = process.env.PORT || 4000; // ✅ changed from 3000

(async () => {
  try {
    await connectToDb();
    console.log('Connected to DB');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Backend server running on port ${port}`);

    /* =============================================
       CRON: Send upcoming-event reminders
       Runs every day at 8:00 AM
    ============================================= */
    cron.schedule('0 8 * * *', async () => {
      console.log('⏰ [CRON] Running upcoming event reminder job...');
      try {
        const { sendUpcomingEventReminders } = require('./services/email.services');
        const result = await sendUpcomingEventReminders();
        console.log(`⏰ [CRON] Reminder job done — ${result.sent} email(s) for ${result.events} event(s).`);
      } catch (err) {
        console.error('⏰ [CRON] Reminder job failed:', err.message);
      }
    });

    console.log('⏰ Cron job scheduled: upcoming event reminders at 8:00 AM daily');
  });
})();
