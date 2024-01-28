import api from "./api";

class PostService {
  getPost(pageSize, pageNumber, searchString) {
    let url = `/Posts?pageSize=${pageSize}&pageNumber=${pageNumber}`;

    if (searchString) {
      url += `&searchString=${searchString}`;
    }

    return api
      .get(url)
      .then((response) => {
        if (response.data.success) {
          return response.data;
        } else {
          return Promise.reject(response.data);
        }
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

export default new PostService();
