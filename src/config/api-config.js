function getApiUrl() {
  if (process.env.NODE_ENV == "production") {
    return "http://103.188.82.49:1111/api";
  }

  return "http://localhost:9999/api";
}

export const BASE_API_URL = getApiUrl();
