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