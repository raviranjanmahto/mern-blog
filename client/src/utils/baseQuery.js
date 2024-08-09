import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = async (args, api, extraOptions) => {
  const fetchBase = fetchBaseQuery({
    baseUrl: `/api/v1`,
    credentials: "include", // Include cookies in requests
  });

  let result = await fetchBase(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await fetch(`/api/v1/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResult.ok) result = await fetchBase(args, api, extraOptions);
  }

  return result;
};

export default baseQuery;
