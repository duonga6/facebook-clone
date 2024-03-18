import api from "./api";

const BASE_URL = "/Posts";

export const postService = {
  // Post
  get(pageSize, pageNumber, searchString) {
    let url = `/Posts?pageSize=${pageSize}&pageNumber=${pageNumber}`;

    if (searchString) {
      url += `&searchString=${searchString}`;
    }

    return api.get(url);
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
};
