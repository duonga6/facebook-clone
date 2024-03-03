function getApiUrl() {
  if (process.env.NODE_ENV == "production") {
    return "https://fbapi.duonga6.top/api";
  }

  return "http://localhost:9999/api";
}

export const BASE_API_URL = getApiUrl();
