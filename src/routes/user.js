const express = require('express');
const userRouter = express.Router();
const validator = require('validator');
const User = require('../models/user')
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/conncetionRequest');
const { set } = require('mongoose');
const USER_SAFE_DATA = "firstName lastName age gender about skills";

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
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId);
            hideUsersFromFeed.add(req.toUserId);
        });

        const users = await User.find({
            _id: { $ne: loggedInUser._id },
            _id: { $nin: Array.from(hideUsersFromFeed) },
        }).select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.send(users)

    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
})


module.exports = userRouter;