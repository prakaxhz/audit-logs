import app from "./app.js";
import env from "./config/env.js";
import logger from "./utils/logger.js";
import connectDatabase from "./config/database.js";

const bootstrap = async () => {
    await connectDatabase();

    app.listen(env.PORT, () => {
        logger.info(`Server Started on Port ${env.PORT}`);
    });
};

bootstrap();