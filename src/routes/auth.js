const express = require('express');
const authRouter = express.Router();
const { validatSignUpData } = require('../utils/validation.js');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const { userAuth } = require('../middleware/auth.js');

authRouter.post('/signUp', async (req, res) => {
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


authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid Credentials');
        };

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = await user.getJWT();
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

authRouter.post('/logout', userAuth, async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        }).json({
            message: "Logged out successfully",
        })


    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
})

module.exports = authRouter;