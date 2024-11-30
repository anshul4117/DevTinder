const express = require('express');
const { userAuth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');
const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
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

profileRouter.patch('/profile/edit', userAuth, (req, res) => {  
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        res.status(200).json({
            message: `${loggedInUser.firstName} your Profile Updated`,
        });

    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
})

module.exports = profileRouter;