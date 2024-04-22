import api from "./api";

const BASE_URL = "/GroupMembers";

export const grMemberService = {
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
  getByGrIdAndUserId(grId, userId) {
    return api.get(BASE_URL + `/${grId}/${userId}`);
  },
  delete(id) {
    return api.delete(BASE_URL + "/" + id);
  },
  deleteByUidGrId(uId, grId) {
    return api.delete(BASE_URL, {
      params: {
        userId: uId,
        groupId: grId,
      },
    });
  },
  createAdmin(id) {
    return api.post(`${BASE_URL}/${id}/Admin`);
  },
  removeAdmin(id) {
    return api.delete(`${BASE_URL}/${id}/Admin`);
  },
};
