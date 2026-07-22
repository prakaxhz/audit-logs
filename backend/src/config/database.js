import mongoose from "mongoose";
import env from "./env.js";
import logger from "../utils/logger.js";

mongoose.set("bufferCommands", false);

let connectionPromise = null;

const connectDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(env.MONGO_URI, {
                serverSelectionTimeoutMS: 15000
            })
            .then((conn) => {
                logger.info("MongoDB Connected");
                return conn;
            })
            .catch((error) => {
                connectionPromise = null;
                logger.error("MongoDB connection failed", { error: error.message });
                throw error;
            });
    }

    return connectionPromise;
};

export default connectDatabase;
