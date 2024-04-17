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
    el.scrollToBottomEvent = () => {
      if (window.scrollY - window.innerHeight >= document.body.offsetHeight) {
        binding.value();
      }
    };

    el.addEventListener("scroll", el.scrollToBottomEvent);
  },
  unmounted: (el) => {
    el.removeEventListener("scroll", el.scrollToBottomEvent);
  },
};
