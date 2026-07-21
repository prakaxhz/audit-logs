import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    search: "",
    role: "",
    severity: "",
    status: "",
    region: "",
    action: "",
    sortBy: "timestamp",
    sortOrder: "desc",
    page: 1,
    limit: 25
};

const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setFilter: (state, action) => {
            Object.assign(state, action.payload);
            state.page = 1;
        },
        resetFilters: () => initialState,
        toggleSort: (state, action) => {
            const field = action.payload;

            if (state.sortBy === field) {
                state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
            } else {
                state.sortBy = field;
                state.sortOrder = "asc";
            }

            state.page = 1;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
            state.page = 1;
        }
    }
});

export const { setFilter, resetFilters, toggleSort, setPage, setLimit } = filtersSlice.actions;

export const selectFilters = (state) => state.filters;

export default filtersSlice.reducer;
