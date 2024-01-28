import api from "./api";

class UserService {
  getUserInfo() {
    return api.get("/Users/Info").then((response) => {
      if (response.data.success) {
        return response.data;
      } else {
        return Promise.reject(response.data);
      }
    });
  }
}

export default new UserService();
