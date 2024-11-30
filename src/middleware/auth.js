const User = require("../models/user");
const jwt = require('jsonwebtoken')

const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
        throw new Error("Admin not authorized");
    } else {
        next();
    }
}
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("You are not login ")
        }
        const decoded = jwt.verify(token, "DevTinder@123");

        const user = await User.findById(decoded._id);
        if (!user) {
            throw new Error('User not found and Authorized');
        }
        req.user = user;
        next();

    } catch (error) {
        res.status(400).json({
            message: "Error : " + error.message
        })
    }
}

module.exports = {
    adminAuth,
    userAuth,
}
