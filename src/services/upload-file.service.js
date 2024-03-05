import axios from "axios";

const KEY = "private_jxKyZTzZmxPIc/B/ZxsTq8tE92w=";
const URL = "https://upload.imagekit.io/api/v1/files/upload";

export const uploadFileService = {
  upload(file, fileName) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Basic ${btoa(`${KEY}:`)}`,
      },
    };
    return axios.post(URL, formData, config);
  },
};
