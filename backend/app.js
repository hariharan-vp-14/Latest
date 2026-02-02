const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const hostRoutes = require('./routes/host.routes');
const administratorRoutes = require('./routes/administrator.routes');
const eventRoutes = require('./routes/event.routes');
const userRoutes = require('./routes/user.routes');
const donationRoutes = require('./routes/donation.route');
const newsletterRoutes = require('./routes/newsletter.route');
const eventRegistrationRoutes = require('./routes/eventRegistration.routes');

const app = express();

/* =======================
   MIDDLEWARE
======================= */

app.use(cors({
    origin: (origin, callback) => {
        const allowList = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            process.env.FRONTEND_URL
        ].filter(Boolean);

        // Non-browser clients (like curl/postman) may not send Origin
        if (!origin) return callback(null, true);

        if (allowList.includes(origin)) return callback(null, true);

        // Allow Vercel preview/prod domains when deploying frontend on Vercel
        try {
            const { hostname } = new URL(origin);
            if (hostname.endsWith('.vercel.app')) return callback(null, true);
        } catch {
            // ignore invalid origin
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =======================
   ROUTES
======================= */

app.use('/api/hosts', hostRoutes);
app.use('/api/administrators', administratorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/event-registrations', eventRegistrationRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend API is running' });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */

app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;
