const express = require('express');
const ConncetionRequest = require('../models/conncetionRequest');
const User = require('../models/user');
const { userAuth } = require('../middleware/auth');
const requestRouter = express.Router()

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const toUserId = req.params.userId;
        const fromUserId = req.user._id;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status " + status });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingConnectionRequest = await ConncetionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection request already sent" });
        }

        const connectionRequest = new ConncetionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        })

    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
})

module.exports = requestRouter;