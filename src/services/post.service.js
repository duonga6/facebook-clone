import api from "./api";

const BASE_URL = "/Posts";

export const postService = {
  // Post
  get(params) {
    return api.get(BASE_URL, {
      params: params,
    });
  },
  getCursor(params) {
    return api.get(BASE_URL + "/Cursor", {
      params: params,
    });
  },
  create(data) {
    return api.post(BASE_URL, data);
  },
  update(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },
  getById(id) {
    return api.get(`${BASE_URL}/${id}`);
  },
  delete(id) {
    return api.delete(`${BASE_URL}/${id}`);
  },
  sharePost(data) {
    return api.post(`${BASE_URL}/Share`, data);
  },
  getStats() {
    return api.get(BASE_URL + "/Stats");
  },
};
