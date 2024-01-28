import { BASE_API_URL } from "@/config/api-config";
import axios from "axios";

const instance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
