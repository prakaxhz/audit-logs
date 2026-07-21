import ApiError from "../../../utils/ApiError.js";
import repository from "../repository/auditLog.repository.js";
import pagination from "../../../utils/pagination.js";

class AuditLogService {

    async upload(logs) {

        if (!logs.length) {
            throw new ApiError(
                400,
                "Logs array cannot be empty."
            );
        }

        try {
            const { insertedCount } = await repository.bulkInsert(logs);

            return {
                insertedCount,
                failedCount: logs.length - insertedCount
            };
        } catch (error) {
            const insertedCount = error?.result?.insertedCount ?? 0;
            const failedCount = logs.length - insertedCount;

            if (insertedCount > 0) {
                return {
                    insertedCount,
                    failedCount,
                    partial: true
                };
            }

            throw new ApiError(
                422,
                "Failed to insert audit logs.",
                error?.writeErrors?.map(e => e.errmsg) || null
            );
        }
    }

    async getLogs(query) {

        const {

            page,

            limit,

            search,

            role,

            severity,

            status,

            region,

            action,

            sortBy = "timestamp",

            sortOrder = "desc"

        } = query;

        const { skip } = pagination(page, limit);

        const filter = {};

        if (role)
            filter.role = role;

        if (severity)
            filter.severity = severity;

        if (status)
            filter.status = status;

        if (region)
            filter.region = region;

        if (action)
            filter.action = action;

        if (search) {

            filter.$or = [

                {
                    actor: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    resource: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    action: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }

        const sort = {

            [sortBy]: sortOrder === "asc" ? 1 : -1

        };

        const [logs, total] = await Promise.all([

            repository.find(filter, {

                skip,

                limit: Number(limit) || 10,

                sort

            }),

            repository.count(filter)

        ]);

        return {

            logs,

            pagination: {

                page: Number(page) || 1,

                limit: Number(limit) || 10,

                total,

                totalPages: Math.ceil(
                    total / (Number(limit) || 10)
                )

            }

        };

    }

}

export default new AuditLogService();