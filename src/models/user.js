const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    about: {
        type: String,
        default: 'No description'
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        default: "male",
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id },
        "DevTinder@123", {
        expiresIn: "1h"
    });
    return token
}

module.exports = mongoose.model("User", userSchema)