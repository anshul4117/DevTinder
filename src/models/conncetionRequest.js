const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignore', 'interested', 'accepted', 'rejected'],
            message: `{VALUE} is incorrect status type`,
        }
    }
},
    { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        return next(new Error("Cannot send connection request to yourself"));
    }
    next();
})


module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);

