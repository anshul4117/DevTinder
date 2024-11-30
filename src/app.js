const express = require('express');
const connectDB = require('./config/db.js');
const User = require('./models/user.js');
const cookieParser = require('cookie-parser')
const app = express();

// 
app.use(express.json());
app.use(cookieParser());


const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const conncetionRouter = require('./routes/profile.js');

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', conncetionRouter   )


connectDB()
    .then(() => {
        console.log('Connected to database');
        app.listen(3000, () => {
            console.log('server is running on port 3000');
        });
    })
    .catch((err) => {
        console.error("Database is not connected!");
    })