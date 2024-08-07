import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = async (args, api, extraOptions) => {
  // Define the fetchBaseQuery with default configuration
  const fetchBase = fetchBaseQuery({
    baseUrl: `${API_URL}/api/v1`,
    credentials: "include", // Include cookies in requests
  });

  // Perform the initial request
  let result = await fetchBase(args, api, extraOptions);

  // Check if the request resulted in a 401 Unauthorized error
  if (result.error && result.error.status === 401) {
    // Attempt to refresh the token
    const refreshResult = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
      method: "POST",
      credentials: "include", // Include cookies in the refresh request
    });

    if (refreshResult.ok) result = await fetchBase(args, api, extraOptions); // Retry the original request after refreshing the token

    // Handle refresh token failure (e.g., logout the user, notify them, etc.)
    if (!refreshResult.ok) window.location.href = "/login";
  }

  return result;
};

export default baseQuery;
