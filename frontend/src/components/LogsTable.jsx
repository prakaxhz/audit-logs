const COLUMNS = [
    { field: "timestamp", label: "Timestamp" },
    { field: "actor", label: "Actor" },
    { field: "role", label: "Role" },
    { field: "action", label: "Action" },
    { field: "resource", label: "Resource" },
    { field: "resourceType", label: "Type" },
    { field: "region", label: "Region" },
    { field: "severity", label: "Severity" },
    { field: "status", label: "Status" }
];

const SeverityBadge = ({ value }) => (
    <span className={`badge severity-${value?.toLowerCase()}`}>{value}</span>
);

const StatusBadge = ({ value }) => (
    <span className={`badge status-${value?.toLowerCase()}`}>{value}</span>
);

const LogsTable = ({ logs, sortBy, sortOrder, onSort, loading }) => {
    return (
        <div className="panel table-wrap">
            {loading && <div className="loading-bar" />}
            <table>
                <thead>
                    <tr>
                        {COLUMNS.map((col) => (
                            <th key={col.field} onClick={() => onSort(col.field)}>
                                {col.label}
                                {sortBy === col.field && (
                                    <span className="sort-arrow">
                                        {sortOrder === "asc" ? " ▲" : " ▼"}
                                    </span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={loading ? "is-loading" : ""}>
                    {!loading && logs.length === 0 && (
                        <tr>
                            <td colSpan={COLUMNS.length} className="empty-cell">
                                No audit logs found.
                            </td>
                        </tr>
                    )}
                    {logs.map((log) => (
                        <tr key={log._id}>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                            <td>{log.actor}</td>
                            <td>{log.role}</td>
                            <td>{log.action}</td>
                            <td className="mono">{log.resource}</td>
                            <td>{log.resourceType}</td>
                            <td>{log.region}</td>
                            <td><SeverityBadge value={log.severity} /></td>
                            <td><StatusBadge value={log.status} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LogsTable;
