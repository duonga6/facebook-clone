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
        (res) => {
          tokenService.setUser(res.data);
          return res;
        },
        (err) => {
          return Promise.reject(err);
        }
      );
  }

  logout() {
    tokenService.removeUser();
  }

  register(user) {
    return api.post("/Users/Register", user).then((res) => {
      tokenService.setUser(res.data);
      return res.data;
    });
  }
}

export default new AuthService();
