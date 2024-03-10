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
    return api.get(`${BASE_URL}/${id}`).catch((err) => {
      throw new Error(`Error post comment service ${err}`);
    });
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
  getFriend(id, params) {
    return api.get(`${BASE_URL}/${id}/Friendship`, {
      params: params,
    });
  },
};
