import api from "./api";
const BASE_URL = "/Admin";

export const adminService = {
  getUser(params) {
    return api.get(BASE_URL + "/Users", {
      params: params,
    });
  },
  getPost(params) {
    return api.get(BASE_URL + "/Posts", {
      params: params,
    });
  },
  getReport(params) {
    return api.get("/Reports", {
      params: params,
    });
  },
};
