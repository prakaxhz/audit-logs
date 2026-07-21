import mongoose from "mongoose";
import { Severity, Status } from "../../../constants/index.js";

const auditLogSchema = new mongoose.Schema(
    {
        actor: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        role: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        action: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        resource: {
            type: String,
            required: true,
            trim: true
        },

        resourceType: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        ipAddress: {
            type: String,
            required: true
        },

        region: {
            type: String,
            required: true
        },

        severity: {
            type: String,
            enum: Object.values(Severity),
            required: true,
            index: true
        },

        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.UNRESOLVED,
            index: true
        },

        timestamp: {
            type: Date,
            required: true,
            index: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

auditLogSchema.index({
    severity: 1,
    status: 1,
    timestamp: -1
});

export default mongoose.model("AuditLog", auditLogSchema);