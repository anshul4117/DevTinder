const express = require('express');
const connectDB = require('./config/db.js');
const User = require('./models/user.js');
const app = express();


app.post('/user', async (req, res) => {
    const user = new User({
        firstName: "PuranChand",
        lastName: "Saini",
        email: "Saini@gmail.com",
        age: 52,
        gender: "male"
    });

    await user.save()
    res.status(201).json({
        message: "User created successfully",
    })

})

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