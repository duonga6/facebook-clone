export const scrollToBottom = {
  beforeMount: (el, binding) => {
    el.scrollToBottomEvent = () => {
      if (el.scrollHeight - el.scrollTop === el.clientHeight) {
        binding.value();
      }
    };

    el.addEventListener("scroll", el.scrollToBottomEvent);
  },
  unmounted: (el) => {
    el.removeEventListener("scroll", el.scrollToBottomEvent);
  },
};

export const scrollToBottomWindow = {
  beforeMount: (el, binding) => {
    el.scrollToBottomWindowEvent = () => {
      const scrollPosition = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (scrollPosition >= scrollHeight) {
        binding.value();
      }
    };

    window.addEventListener("scroll", el.scrollToBottomWindowEvent);
  },
  unmounted: (el) => {
    window.removeEventListener("scroll", el.scrollToBottomWindowEvent);
  },
};
