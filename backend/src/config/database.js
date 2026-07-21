import mongoose from "mongoose";
import env from "./env.js";
import logger from "../utils/logger.js";

const connectDatabase = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);

        logger.info("MongoDB Connected");
    } catch (error) {
        logger.error("MongoDB connection failed", { error: error.message });

        process.exit(1);
    }
};

export default connectDatabase;