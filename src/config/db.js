const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://anshul41171:anshul7906@cluster0.bavzsco.mongodb.net/devTinder"
        );
    } catch (error) {
        console.error("MongoDB connection Failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
