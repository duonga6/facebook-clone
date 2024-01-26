/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  purge: [
    "./index.html",
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0866FF",
        dark: "#050505",
        error: "#EF4444",
      },
      width: {
        90: "360px",
      },
      height: {
        0.75: "3px",
        62: "248px",
      },
      fontSize: {
        md: "15px",
        17: "17px",
        13: "13px",
        15: "15px",
        11: "11px",
      },
      maxWidth: {
        "news-width": "680px",
        "register-form": "432px",
      },
    },
  },
  plugins: [],
};
