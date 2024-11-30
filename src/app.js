const express = require('express');
const connectDB = require('./config/db.js');
const User = require('./models/user.js');
const validatSignUpData = require('../utils/user.js');
const { userAuth } = require('./middleware/auth.js')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const app = express();

// 
app.use(express.json());
app.use(cookieParser());


app.post('/signUp', async (req, res) => {
    try {

        const { firstName, lastName, email, password } = req.body;

        // validate the data
        validatSignUpData(req)

        // Encrypt the Password
        const hashPassword = await bcrypt.hash(password, 10)

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
        });
        await user.save()
        res.status(201).json({
            message: "User created successfully",
        })
    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }

});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid Credentials');
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = await user.getJWT();
            console.log("token : ", token)

            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 3600000),
            }).json({
                message: "Logged in successfully",
            })
        } else {
            throw new Error('Invalid Credentials');
        }
    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            message: "getting Details",
            user
        })
    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
})

app.get('/user', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({
            message: "Error fetching user",
        })
    }
});


app.patch('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        const ALLLOWED_UPDATES = [
            "sports", "gender", "age"
        ]

        const isUpdateAllowed = Object.keys(data).every((k) => {
            return ALLLOWED_UPDATES.includes(k)
        });
        console.log(isUpdateAllowed);
        if (!isUpdateAllowed) {
            throw new Error("update not allow");
        }

        if (data?.skills?.length > 5) {
            return res.status(400).json({
                message: "You can't add more than 10 skills",
            })
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true,
        });
        res.status(200).json(user)

    } catch (error) {
        res.status(400).json({
            message: "Error updating user : " + error.message
        })
    }
})

app.delete('/user', async (req, res) => {
    try {
        const userId = req.body.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).json({
                message: "User not found",
            })
        }
        res.status(200).json({
            message: "User deleted successfully",
        })
    } catch (error) {
        res.status(400).json({
            message: "Error deleting user",
        })
    }
});

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(400).json({
            message: "Error fetching feed"
        })
    }
});

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