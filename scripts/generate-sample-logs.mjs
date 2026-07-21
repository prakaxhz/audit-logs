import { writeFileSync } from "node:fs";

const COUNT = Number(process.argv[2]) || 10000;
const OUT = process.argv[3] || "sample-logs.json";

const ACTORS = ["priya.nair@company.com", "jon.smith@company.com", "amara.okoye@company.com", "li.wei@company.com"];
const ROLES = ["admin", "analyst", "viewer", "auditor"];
const ACTIONS = ["DELETE_USER", "LOGIN", "UPDATE_ROLE", "EXPORT_DATA", "CREATE_TOKEN", "DISABLE_MFA"];
const RESOURCE_TYPES = ["USER", "TOKEN", "REPORT", "SESSION", "ROLE"];
const REGIONS = ["ap-south-1", "us-east-1", "eu-west-1", "sa-east-1"];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH"];
const STATUSES = ["Resolved", "Unresolved"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomIp = () => `${1 + Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
const randomTimestamp = () => {
    const start = new Date("2025-01-01").getTime();
    const end = new Date("2025-12-31").getTime();
    return new Date(start + Math.random() * (end - start)).toISOString();
};

const logs = Array.from({ length: COUNT }, (_, i) => ({
    actor: pick(ACTORS),
    role: pick(ROLES),
    action: pick(ACTIONS),
    resource: `/api/users/${i}`,
    resourceType: pick(RESOURCE_TYPES),
    ipAddress: randomIp(),
    region: pick(REGIONS),
    severity: pick(SEVERITIES),
    status: pick(STATUSES),
    timestamp: randomTimestamp()
}));

writeFileSync(OUT, JSON.stringify(logs));
console.log(`Wrote ${COUNT} sample logs to ${OUT}`);
