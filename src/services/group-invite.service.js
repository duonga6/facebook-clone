import api from "./api";

const BASE_URL = "/GroupInvites";

export const groupInviteService = {
  get(params) {
    return api.get(BASE_URL, {
      params: params,
    });
  },
  getCursor(params) {
    return api.get(`${BASE_URL}/Cursor`, {
      params: params,
    });
  },
  create(data) {
    return api.post(BASE_URL, data);
  },
  delete(id) {
    return api.delete(BASE_URL + `/${id}`);
  },
  deleteByGroupId(groupId) {
    return api.delete(BASE_URL + `?groupId=${groupId}`);
  },
  accept(id) {
    return api.put(BASE_URL + `/${id}`);
  },
  getById(id) {
    return api.get(BASE_URL + `/${id}`);
  },
  getByUIDandGrID(groupId, userId) {
    return api.get(BASE_URL + `/${groupId}/${userId}`);
  },
};
