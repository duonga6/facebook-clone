import api from "./api";
import tokenService from "./token.service";

class AuthService {
  login(user) {
    return api
      .post("/Users/Login", {
        email: user.email,
        password: user.password,
      })
      .then(
        (response) => {
          if (response.data.success) {
            tokenService.setUser(response.data.data);
            return response.data;
          } else {
            return Promise.reject(response.data);
          }
        },
        (err) => {
          console.log(err);
          return Promise.reject(err);
        }
      );
  }

  logout() {
    tokenService.removeUser();
  }

  register(user) {
    return api.post("/Users/Register", user).then((response) => {
      if (response.data.success) {
        tokenService.setUser(response.data.data);
        return response.data;
      } else {
        return Promise.reject(response.data);
      }
    });
  }
}

export default new AuthService();
