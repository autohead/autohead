import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithAuthCheck from '../baseQueryWithAuthCheck';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuthCheck,
  tagTypes: ['Category', 'Product', 'Dashboard', 'Billing', 'DropDown', 'Vendor', 'VendorProduct'],
  endpoints: () => ({}),
});