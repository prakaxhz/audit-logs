import { useDispatch, useSelector } from "react-redux";
import {
    selectFilters,
    setFilter,
    resetFilters,
    toggleSort,
    setPage,
    setLimit
} from "../features/auditLogs/filtersSlice.js";
import { useGetAuditLogsQuery } from "../features/auditLogs/auditLogsApi.js";
import UploadPanel from "../components/UploadPanel.jsx";
import FiltersBar from "../components/FiltersBar.jsx";
import LogsTable from "../components/LogsTable.jsx";
import PaginationBar from "../components/PaginationBar.jsx";

const DashboardPage = () => {
    const dispatch = useDispatch();
    const filters = useSelector(selectFilters);

    const { data, isFetching, error } = useGetAuditLogsQuery(filters);

    const logs = data?.logs ?? [];
    const pagination = data?.pagination ?? { total: 0, totalPages: 1 };

    return (
        <div className="app">
            <header className="app-header">
                <h1>Audit Log Dashboard</h1>
                <p>Upload, search, filter, and investigate system audit logs.</p>
            </header>

            <UploadPanel />

            <FiltersBar
                filters={filters}
                onChange={(partial) => dispatch(setFilter(partial))}
                onReset={() => dispatch(resetFilters())}
            />

            {error && (
                <p className="status-error">
                    {error.data?.message || "Failed to load audit logs."}
                </p>
            )}

            <LogsTable
                logs={logs}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSort={(field) => dispatch(toggleSort(field))}
                loading={isFetching}
            />

            <PaginationBar
                page={filters.page}
                limit={filters.limit}
                total={pagination.total}
                totalPages={pagination.totalPages}
                onPageChange={(nextPage) => dispatch(setPage(nextPage))}
                onLimitChange={(nextLimit) => dispatch(setLimit(nextLimit))}
            />
        </div>
    );
};

export default DashboardPage;
