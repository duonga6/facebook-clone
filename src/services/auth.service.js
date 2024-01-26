import axios from "axios";
import { BASE_API_URL } from "@/config/api-config";

class AuthService {
  login(user) {
    return axios
      .post(BASE_API_URL + "/Users/Login", {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("token", JSON.stringify(response.data.data));
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      });
  }

  logout() {
    localStorage.removeItem("token");
  }

  register(user) {
    return axios
      .post(BASE_API_URL + "/Users/Register", {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
      })
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("token", JSON.stringify(response.data.data));
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      });
  }
}

export default new AuthService();
