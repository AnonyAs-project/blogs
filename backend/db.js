// db.js
const mongoose = require("mongoose");
const logger = require("./config/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Connected successfully to database");
  } catch (err) {
    logger.error("Error connecting to database", { error: err.message });
    process.exit(1);
  }
};

module.exports = connectDB;
