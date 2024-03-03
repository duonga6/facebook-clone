/* eslint-disable */

import api from "./api";
const BASE_URL = "/Users";

export const userService = {
  async getById(id) {
    try {
      var res = await api.get(`${BASE_URL}/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
}
