export const scrollToBottom = {
  beforeMount: (el, binding) => {
    el.scrollToBottomEvent = () => {
      if (el.scrollHeight - el.clientHeight - el.scrollTop < 2) {
        binding.value();
      }
    };

    el.addEventListener("scroll", el.scrollToBottomEvent);
  },
  unmounted: (el) => {
    el.removeEventListener("scroll", el.scrollToBottomEvent);
  },
};

export const scrollNearBottom = {
  beforeMount: (el, binding) => {
    el.scrollToBottomEvent = () => {
      // Quãng đường đi được chia tổng quãng đường
      if (el.scrollTop / (el.scrollHeight - el.clientHeight) > 0.7) {
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

export const scrollToNearBottomWindow = {
  beforeMount: (el, binding) => {
    el.scrollToBottomWindowEvent = () => {
      const scrollPosition = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (scrollHeight / scrollPosition < 1.2) {
        binding.value();
      }
    };

    window.addEventListener("scroll", el.scrollToBottomWindowEvent);
  },
  unmounted: (el) => {
    window.removeEventListener("scroll", el.scrollToBottomWindowEvent);
  },
};

export const scrollToNearTop = {
  beforeMount: (el, binding) => {
    el.scrollToBottomEvent = () => {
      if (el.scrollTop / (el.scrollHeight - el.clientHeight) < 0.3) {
        binding.value();
      }
    };

    el.addEventListener("scroll", el.scrollToBottomEvent);
  },
  unmounted: (el) => {
    el.removeEventListener("scroll", el.scrollToBottomEvent);
  },
};

export const scrollToTop = {
  beforeMount: (el, binding) => {
    el.scrollToBottomEvent = () => {
      if (el.scrollHeight - el.clientHeight - el.scrollTop < 2) {
        binding.value();
      }
    };

    el.addEventListener("scroll", el.scrollToBottomEvent);
  },
  unmounted: (el) => {
    el.removeEventListener("scroll", el.scrollToBottomEvent);
  },
};
