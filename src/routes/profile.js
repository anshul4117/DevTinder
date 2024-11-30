const express = require('express');
const { userAuth } = require('../middleware/auth')
const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
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

module.exports = profileRouter;