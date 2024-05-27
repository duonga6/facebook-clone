import api from "./api";
const BASE_URL = "/Users";

export const userService = {
  getUserInfo() {
    return api.get(`${BASE_URL}/Info`);
  },

  getById(id) {
    return api.get(`${BASE_URL}/${id}`);
  },
  getPost(id, params) {
    return api.get(`${BASE_URL}/${id}/Posts`, {
      params: params,
    });
  },
  get(params) {
    return api.get(BASE_URL, { params: params });
  },
  update(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },
  getPostCursor(id, params) {
    return api.get(`${BASE_URL}/${id}/Posts/Cursor`, {
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
  changeCoverImage(data) {
    return api.put(BASE_URL + "/CoverImage", data);
  },
  changeAvatar(data) {
    return api.put(BASE_URL + "/Avatar", data);
  },
  changePassword(data) {
    return api.put(BASE_URL + "/ChangePassword", data);
  },
  getByEmail(email) {
    return api.get(BASE_URL + "/FindByEmail", {
      params: {
        email: email,
      },
    });
  },
  forgotPassword(email) {
    return api.post(BASE_URL + "/ForgotPassword", {
      email: email,
    });
  },
  resetPassword(data) {
    return api.post(BASE_URL + "/ResetPassword", data);
  },
  getStats() {
    return api.get(BASE_URL + "/Stats");
  },
  addRole(id, data) {
    return api.post(`${BASE_URL}/${id}/Roles`, data);
  },
  removeRole(id, data) {
    return api.put(`${BASE_URL}/${id}/Roles`, data);
  },
  lock(id) {
    return api.post(`${BASE_URL}/${id}/Lockout`);
  },
  unLock(id) {
    return api.post(`${BASE_URL}/${id}/UnLockout`);
  },
  confirmEmail(data) {
    return api.post(BASE_URL + "/ConfirmEmail", data);
  },
};
