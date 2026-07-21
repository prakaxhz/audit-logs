import { useState } from "react";
import { useUploadAuditLogsMutation } from "../features/auditLogs/auditLogsApi.js";

const UploadPanel = () => {
    const [uploadAuditLogs, { isLoading }] = useUploadAuditLogsMutation();
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        e.target.value = "";

        if (!file) return;

        setError(null);
        setResult(null);

        let logs;

        try {
            const text = await file.text();
            logs = JSON.parse(text);
        } catch {
            setError("File is not valid JSON.");
            return;
        }

        if (!Array.isArray(logs)) {
            setError("JSON file must contain an array of log records.");
            return;
        }

        try {
            const data = await uploadAuditLogs(logs).unwrap();
            setResult(data);
        } catch (err) {
            const errors = err?.data?.errors;
            const detail = Array.isArray(errors) && errors.length
                ? ` (${errors.length} validation issue${errors.length > 1 ? "s" : ""}, e.g. "${errors[0].path}: ${errors[0].message}")`
                : "";
            setError(`${err?.data?.message || "Upload failed."}${detail}`);
        }
    };

    return (
        <div className="panel upload-panel">
            <div className="upload-row">
                <label className="file-input">
                    <input
                        type="file"
                        accept="application/json"
                        onChange={handleFile}
                        disabled={isLoading}
                    />
                    {isLoading ? "Uploading..." : "Upload JSON log file"}
                </label>
                <span className="hint">Expects a JSON array of up to 10,000 log records.</span>
            </div>

            {result && (
                <p className={result.partial ? "status-warn" : "status-ok"}>
                    Inserted {result.insertedCount} log{result.insertedCount === 1 ? "" : "s"}
                    {result.failedCount > 0 ? `, ${result.failedCount} failed` : ""}.
                </p>
            )}

            {error && <p className="status-error">{error}</p>}
        </div>
    );
};

export default UploadPanel;
