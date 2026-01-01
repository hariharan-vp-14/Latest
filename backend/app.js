const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const userPartRoutes = require('./routes/userpart.routes');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user', userRoutes);
app.use('/userpart', userPartRoutes);

app.get('/',(req,res) => {
    res.send('Hello World');
});

module.exports = app;
