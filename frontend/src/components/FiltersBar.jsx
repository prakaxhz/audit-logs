import { useEffect, useState } from "react";

const SEVERITIES = ["LOW", "MEDIUM", "HIGH"];
const STATUSES = ["Resolved", "Unresolved"];

const FiltersBar = ({ filters, onChange, onReset }) => {
    const [searchInput, setSearchInput] = useState(filters.search);
    const [syncedSearch, setSyncedSearch] = useState(filters.search);

    if (filters.search !== syncedSearch) {
        setSyncedSearch(filters.search);
        setSearchInput(filters.search);
    }

    useEffect(() => {
        if (searchInput === filters.search) return;

        const debounce = setTimeout(() => {
            onChange({ search: searchInput });
        }, 300);

        return () => clearTimeout(debounce);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    const handleField = (field) => (e) => onChange({ [field]: e.target.value });

    return (
        <div className="panel filters-bar">
            <input
                type="text"
                placeholder="Search actor, action, resource..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="search-input"
            />

            <input
                type="text"
                placeholder="Role"
                value={filters.role}
                onChange={handleField("role")}
            />

            <select value={filters.severity} onChange={handleField("severity")}>
                <option value="">All severities</option>
                {SEVERITIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            <select value={filters.status} onChange={handleField("status")}>
                <option value="">All statuses</option>
                {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Region"
                value={filters.region}
                onChange={handleField("region")}
            />

            <input
                type="text"
                placeholder="Action"
                value={filters.action}
                onChange={handleField("action")}
            />

            <button type="button" className="btn-secondary" onClick={onReset}>
                Reset
            </button>
        </div>
    );
};

export default FiltersBar;
