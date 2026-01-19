import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./slices/authApiSlice";
import { baseApi } from "./slices/baseApiSlice";

export const store = configureStore({
    reducer: {
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [baseApi.reducerPath]: baseApi.reducer,

    },
    /**
     * Middleware configuration for the store.
     *
     * It concatenates the default middleware with the middleware
     * from the authApiSlice, categoryApiSlice, and vendorApiSlice.
     *
     * This is necessary to enable the use of RTK Query's caching
     * and other features in the application.
     */
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApiSlice.middleware)
            .concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;