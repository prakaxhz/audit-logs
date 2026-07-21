const PaginationBar = ({ page, limit, total, totalPages, onPageChange, onLimitChange }) => {
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="panel pagination-bar">
            <span className="pagination-info">
                {from}-{to} of {total}
            </span>

            <div className="pagination-controls">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    Prev
                </button>
                <span>Page {page} of {totalPages || 1}</span>
                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                </button>
            </div>

            <select value={limit} onChange={(e) => onLimitChange(Number(e.target.value))}>
                {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>{n} / page</option>
                ))}
            </select>
        </div>
    );
};

export default PaginationBar;
