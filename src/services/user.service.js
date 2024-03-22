import api from "./api";
const BASE_URL = "/Users";

export const userService = {
  getUserInfo() {
    return api
      .get(`${BASE_URL}/Info`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },

  getById(id) {
    return api.get(`${BASE_URL}/${id}`);
  },
  getPost(id, params) {
    return api.get(`${BASE_URL}/${id}/Posts`, {
      params: params,
    });
  },
  getPhoto(id, params) {
    return api.get(`${BASE_URL}/${id}/GetPhotos`, {
      params: params,
    });
  },
  getFriends(id, params) {
    return api.get(`${BASE_URL}/${id}/Friendships`, {
      params: params,
    });
  },
};
