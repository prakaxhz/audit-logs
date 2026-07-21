import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ZodError) {
        err = new ApiError(
            400,
            "Validation failed.",
            err.issues.map(issue => ({
                path: issue.path.join("."),
                message: issue.message
            }))
        );
    }

    if (!(err instanceof ApiError)) {
        err = new ApiError(
            500,
            err.message || "Internal Server Error"
        );
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors,
        ...(env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
};

export default errorMiddleware;