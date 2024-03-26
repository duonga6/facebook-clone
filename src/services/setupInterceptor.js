import eventBus from "@/common/EventBus";
import axiosInstance from "./api";
import tokenService from "./token.service";

const setup = (store) => {
  // Thiết lập interceptors cho request
  axiosInstance.interceptors.request.use(
    (config) => {
      // Lấy token từ local storage
      const token = tokenService.getLocalToken();
      // Nếu có token thì gán vào header
      if (token) {
        config.headers["Authorization"] = "Bearer " + token.accessToken;
      }
      // Trả về config để tiếp tục request
      return config;
    },
    // Xử lý khi có lỗi
    (error) => {
      return Promise.reject(error);
    }
  );

  // Thiết lập interceptors cho response
  axiosInstance.interceptors.response.use(
    // response không lỗi => response
    (res) => {
      if (res.data.success) {
        return res.data;
      } else {
        if (res.data.errors) {
          return Promise.reject(res.data.errors);
        }
        return Promise.reject(res);
      }
    },
    // response có lỗi
    async (err) => {
      // Lưu lại config ban đầu
      const originalConfig = err.config;
      // Nếu request không phải login
      if (originalConfig.url !== "/Users/Login" && err.response) {
        // Xử lý trường hợp Unauthorize
        if (err.response.status === 401) {
          if (!originalConfig._retry) {
            // Đánh dấu đã retry để chỉ lặp 1 lần
            originalConfig._retry = true;

            // Nếu có token thì làm mới token rồi request lại
            if (tokenService.getLocalToken()) {
              // Gọi API tạo mới token
              const rs = await axiosInstance.post(
                "/Users/RenewToken",
                tokenService.getLocalToken()
              );

              if (rs.success) {
                const newToken = rs.data;
                // Lưu token mới vào store
                store.dispatch("auth/refreshToken", newToken);
                // Lưu token mới vào local storage
                tokenService.updateLocalToken(newToken);
                // Thực hiện lại request ban đầu
                return axiosInstance(originalConfig);
              } else {
                eventBus.dispatch("logout");
                return Promise.reject(rs);
              }
            } else {
              eventBus.dispatch("logout");
            }
          }
        }
      }

      // Các lỗi khác
      return Promise.reject(err);
    }
  );
};

export default setup;
