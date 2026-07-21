import { configureStore } from "@reduxjs/toolkit";
import { auditLogsApi } from "../features/auditLogs/auditLogsApi.js";
import filtersReducer from "../features/auditLogs/filtersSlice.js";

export const store = configureStore({
    reducer: {
        filters: filtersReducer,
        [auditLogsApi.reducerPath]: auditLogsApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(auditLogsApi.middleware)
});
