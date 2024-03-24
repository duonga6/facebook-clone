import api from "@/services/api";
const BASE_URL = "/Notifications/GetCursor";

export const notificatonService = {
  get(params) {
    return api.get(BASE_URL, {
      params: params,
    });
  },
};
