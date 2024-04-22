import api from "@/services/api";

const BASE_URL = "/Groups";

export const groupService = {
  get(params) {
    return api.get(BASE_URL, {
      params: params,
    });
  },
  getById(id) {
    return api.get(BASE_URL + `/${id}`);
  },
  create(data) {
    return api.post(BASE_URL, data);
  },
  update(id, data) {
    return api.put(`${BASE_URL}/${id}`, data);
  },
  delete(id) {
    return api.delete(`${BASE_URL}/${id}`);
  },

  getMedia(id, params) {
    return api.get(BASE_URL + `/${id}/Medias`, {
      params: params,
    });
  },
  getPostFeed(params) {
    return api.get(BASE_URL + "/Feed", {
      params: params,
    });
  },
};
