import eventBus from "@/common/EventBus";

export const toastAlert = {
  error(message) {
    eventBus.dispatch("toastAlert", {
      type: "error",
      message: message,
    });
  },
};
