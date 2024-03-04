export const BASE_API_URL =
  process.env.NODE_ENV == "production"
    ? "https://fbapi.duonga6.top/api"
    : "http://localhost:9999/api";
