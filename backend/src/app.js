import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import logger from "./utils/logger.js";

import routes from "./routes/index.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(compression());

app.use(
    morgan("combined", {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    })
);

app.use(express.json({ limit: "5mb" }));

app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use("/api", routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;