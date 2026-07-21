import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("Missing required environment variable: MONGO_URI");
}

export default Object.freeze({
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 5000,
    MONGO_URI: process.env.MONGO_URI
});