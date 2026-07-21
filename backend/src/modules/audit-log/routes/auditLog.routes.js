import { Router } from "express";
import rateLimit from "express-rate-limit";

import controller from "../controller/auditLog.controller.js";

import validate from "../../../middlewares/validate.middleware.js";

import {
    uploadAuditLogsSchema,
    getLogsQuerySchema
} from "../validator/auditLog.validator.js";

const router = Router();

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false
});

const readLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
});

router.post(
    "/upload",
    uploadLimiter,
    validate(uploadAuditLogsSchema),
    controller.upload
);

router.get(
    "/",
    readLimiter,
    validate(getLogsQuerySchema, "query"),
    controller.getLogs
);

export default router;
