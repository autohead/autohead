import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { BASE_URL, HttpMethod } from "../constants";
import type { AuthTokenResponse } from "../types/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers : any, { endpoint }) => {
    if (endpoint !== "refreshToken") {
      const token = localStorage.getItem("adminToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // If request is successful, check if new tokens came from login
  if (result.data && (api.endpoint === "login")) {
    const loginData = result.data as AuthTokenResponse;
    localStorage.setItem("adminToken", loginData.access);
    localStorage.setItem("adminRefreshToken", loginData.refresh);
    localStorage.setItem("is_superuser", JSON.stringify(loginData.is_superuser));
    // console.log(loginData);
    return result;
  }

  // If unauthorized → try refresh
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("adminRefreshToken");

    if (!refreshToken) {
      logoutAndRedirect();
      return result;
    }

    // CALL REFRESH ENDPOINT
    const refreshResult = (await baseQuery(
      {
        url: "token/refresh/",
        method: HttpMethod.POST,
        body: { refresh: refreshToken },
      },
      { ...api, endpoint: "refreshToken" }, 
      extraOptions
    )) as { data?: AuthTokenResponse; error?: FetchBaseQueryError };

    if (refreshResult.data) {
      // Store fresh token
      localStorage.setItem("adminToken", refreshResult.data.access);
      // retry original request with fresh token
      result = await baseQuery(args, api, extraOptions);
    } else {
      logoutAndRedirect();
    }
  }

  return result;
};

function logoutAndRedirect() {
  alert("session expired and this alert is for testing purposes");
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload(); // reloads app → App.tsx shows SignInPage
}


export default baseQueryWithReauth;
