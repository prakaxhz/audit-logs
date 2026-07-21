import asyncHandler from "../../../middlewares/asyncHandler.js";
import ApiResponse from "../../../utils/ApiResponse.js";

import AuditLogDTO from "../dto/auditLog.dto.js";
import service from "../service/auditLog.service.js";

class AuditLogController {

    upload = asyncHandler(async (req, res) => {

        const logs = AuditLogDTO.upload(
            req.validatedData
        );

        const result = await service.upload(logs);

        return ApiResponse.created(
            res,
            "Logs uploaded successfully.",
            result
        );

    });

    getLogs = asyncHandler(async (req, res) => {

        const result = await service.getLogs(req.validatedData);

        return ApiResponse.success(
            res,
            "Logs fetched successfully.",
            result

        );

    });

}

export default new AuditLogController();