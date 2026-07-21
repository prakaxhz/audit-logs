import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const auditLogsApi = createApi({
    reducerPath: "auditLogsApi",
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ["AuditLog"],
    endpoints: (builder) => ({
        getAuditLogs: builder.query({
            query: (params) => {
                const search = new URLSearchParams();

                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        search.set(key, value);
                    }
                });

                return `/audit-logs?${search.toString()}`;
            },
            transformResponse: (response) => response.data,
            providesTags: ["AuditLog"]
        }),

        uploadAuditLogs: builder.mutation({
            query: (logs) => ({
                url: "/audit-logs/upload",
                method: "POST",
                body: logs
            }),
            transformResponse: (response) => response.data,
            invalidatesTags: ["AuditLog"]
        })
    })
});

export const { useGetAuditLogsQuery, useUploadAuditLogsMutation } = auditLogsApi;
