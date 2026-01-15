const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const hostRoutes = require('./routes/host.routes');
const administratorRoutes = require('./routes/administrator.routes');
const eventRoutes = require('./routes/event.routes');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/host', hostRoutes);
app.use('/administrator', administratorRoutes);
app.use('/event', eventRoutes);
app.use('/user', userRoutes);

app.get('/',(req,res) => {
    res.send('Hello World');
});

module.exports = app;
