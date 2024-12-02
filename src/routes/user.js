const express = require('express');
const userRouter = express.Router();
const validator = require('validator');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/conncetionRequest')

userRouter.get('/user/requests', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"])
        if (connectionRequests.length == 0) {
            return res.status(404).json({ message: "No connection requests found" })
        }
        res.json(connectionRequests)

    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
});


userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["fristName", "lastName", "age"])
            .populate("toUserId", ["firstName", "lastName", "age"])

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id == loggedInUser._id) {
                return row.toUserId;
            }
            return row.fromUserId
        })

        res.json({
            data
        })


    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const feed = await ConnectionRequest.find({
            $nor: [
                { fromUserId: loggedInUser._id },
            ]
        })

    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
})


module.exports = userRouter;