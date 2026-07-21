import { z } from "zod";
import { Severity, Status } from "../../../constants/index.js";

export const auditLogSchema = z.object({

    actor: z.string().min(1),

    role: z.string().min(1),

    action: z.string().min(1),

    resource: z.string().min(1),

    resourceType: z.string().min(1),

    ipAddress: z.union([z.ipv4(), z.ipv6()]),

    region: z.string().min(1),

    severity: z.enum(Object.values(Severity)),

    status: z.enum(Object.values(Status)),

    timestamp: z.string().datetime()
});

export const uploadAuditLogsSchema = z
    .array(auditLogSchema)
    .min(1)
    .max(10000);

const sortableFields = [
    "timestamp",
    "actor",
    "role",
    "action",
    "resource",
    "resourceType",
    "region",
    "severity",
    "status",
    "createdAt"
];

export const getLogsQuerySchema = z.object({

    page: z.coerce.number().int().min(1).optional(),

    limit: z.coerce.number().int().min(1).max(100).optional(),

    search: z.string().trim().min(1).max(200).optional(),

    role: z.string().trim().min(1).optional(),

    severity: z.enum(Object.values(Severity)).optional(),

    status: z.enum(Object.values(Status)).optional(),

    region: z.string().trim().min(1).optional(),

    action: z.string().trim().min(1).optional(),

    sortBy: z.enum(sortableFields).optional(),

    sortOrder: z.enum(["asc", "desc"]).optional()

});
