import eventBus from "@/common/EventBus";

export const toastAlert = {
  error(message) {
    eventBus.dispatch("toastAlert", {
      type: "error",
      message: message,
    });
  },
  success(message) {
    eventBus.dispatch("toastAlert", {
      type: "success",
      message: message,
    });
  },
};
