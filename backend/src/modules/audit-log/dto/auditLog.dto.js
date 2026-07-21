class AuditLogDTO {

    static upload(logs) {

        return logs.map(log => ({

            actor: log.actor,

            role: log.role,

            action: log.action,

            resource: log.resource,

            resourceType: log.resourceType,

            ipAddress: log.ipAddress,

            region: log.region,

            severity: log.severity,

            status: log.status,

            timestamp: new Date(log.timestamp)

        }));

    }

}

export default AuditLogDTO;