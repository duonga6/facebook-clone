<template>
  <div class="flex justify-center">
    <svg
      class="animate-spin duration-1000 -ml-1 mr-3 text-white"
      :class="classCss"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-75 text-primary"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    classCss: {
      type: String,
      default: "h-5 w-5",
    },
  },
  setup() {},
};
</script>
