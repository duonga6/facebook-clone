import api from "./api";

const BASE_URL = "/Posts";

export const postService = {
  // Post
  get(pageSize, pageNumber, searchString) {
    let url = `/Posts?pageSize=${pageSize}&pageNumber=${pageNumber}`;

    if (searchString) {
      url += `&searchString=${searchString}`;
    }

    return api.get(url).catch((err) => {
      throw new Error(`Error post service ${err}`);
    });
  },
  create(data) {
    return api.post(BASE_URL, data).catch((err) => {
      throw new Error(`Error post service ${err}`);
    });
  },
  update(id, data) {
    return api.put(`${BASE_URL}/${id}`, data).catch((err) => {
      throw new Error(`Error post service ${err}`);
    });
  },
};
