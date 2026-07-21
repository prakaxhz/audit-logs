import { Router } from "express";

import auditLogRoutes from "../modules/audit-log/routes/auditLog.routes.js";

const router = Router();

router.use("/audit-logs", auditLogRoutes);

router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "API Working",
    });
});

export default router;