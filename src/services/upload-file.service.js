import axios from "axios";

export const uploadFileService = {
  upload(file) {
    return axios.post("https://freeimage.host/api/1/upload", {
      key: "6d207e02198a847aa98d0a2a901485a5",
      format: "json",
      source: file,
    });
  },
};
