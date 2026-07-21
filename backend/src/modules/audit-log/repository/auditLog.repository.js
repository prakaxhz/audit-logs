import AuditLog from "../model/auditLog.model.js";

class AuditLogRepository {

    async bulkInsert(logs) {
        const result = await AuditLog.insertMany(logs, {
            ordered: false,
            rawResult: true
        });

        return {
            insertedCount: result.insertedCount
        };
    }

    async count(filter = {}) {
        return AuditLog.countDocuments(filter);
    }

    async find(filter = {}, options = {}) {
        return AuditLog.find(filter)
            .sort(options.sort || { timestamp: -1 })
            .skip(options.skip || 0)
            .limit(options.limit || 10)
            .lean();
    }

}

export default new AuditLogRepository();
