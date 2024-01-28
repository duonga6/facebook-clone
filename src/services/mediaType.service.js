import api from "./api";

class MediaTypeService {
  getAll() {
    return api.get("/MediaType").then((response) => {
      if (response.data.success) {
        return response.data;
      } else {
        return Promise.reject(response.data);
      }
    });
  }

  getById(id) {
    return api.get("/MediaType/" + id).then((response) => {
      if (response.data.success) {
        return response.data;
      } else {
        return Promise.reject(response.data);
      }
    });
  }
}

export default new MediaTypeService();
