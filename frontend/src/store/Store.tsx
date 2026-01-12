import { configureStore } from "@reduxjs/toolkit";
import { authApiSlice } from "./slices/authApiSlice";
import { categoryApiSlice } from "./slices/categoryApiSlice";
import { vendorApiSlice } from "./slices/vendorApiSlice";
import { productApiSlice } from "./slices/productApiSlice";
import { dropDownApiSlice } from "./slices/dropDownApiSlice";
import { vendorProductApiSlice } from "./slices/vendorProductsApiSlice";
import { billingApiSlice } from "./slices/billingApiSlice";
import { dashboardApiSlice } from "./slices/dashboardApiSlice";

export const store = configureStore({
    reducer: {
        [authApiSlice.reducerPath]: authApiSlice.reducer,
        [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
        [vendorApiSlice.reducerPath]: vendorApiSlice.reducer,
        [productApiSlice.reducerPath]: productApiSlice.reducer,
        [dropDownApiSlice.reducerPath]: dropDownApiSlice.reducer,
        [vendorProductApiSlice.reducerPath]: vendorProductApiSlice.reducer,
        [billingApiSlice.reducerPath]:billingApiSlice.reducer,
        [dashboardApiSlice.reducerPath]:dashboardApiSlice.reducer

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
            .concat(categoryApiSlice.middleware)
            .concat(vendorApiSlice.middleware)
            .concat(productApiSlice.middleware)
            .concat(dropDownApiSlice.middleware)
            .concat(vendorProductApiSlice.middleware)
            .concat(billingApiSlice.middleware)
            .concat(dashboardApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;