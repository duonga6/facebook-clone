import { BASE_API_URL } from "@/config/api-config";
import authHeader from "./auth-header";
import axios from "axios";

const API_URL = BASE_API_URL + "/Users";

class UserService {
  getUserInfo() {
    return axios
      .get(API_URL + "/Info", { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      });
  }
}

export default new UserService();
