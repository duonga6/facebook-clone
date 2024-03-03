import api from "./api";

class MediaTypeService {
  getAll() {
    return api.get("/MediaType").then((res) => {
      return res;
    });
  }

  getById(id) {
    return api.get("/MediaType/" + id).then((res) => {
      return res;
    });
  }
}

export default new MediaTypeService();
