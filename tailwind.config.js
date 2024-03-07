/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0866FF",
        dark: "#050505",
        error: "#EF4444",
        "primary-50": "rgb(var(--primary-50))",
        "primary-100": "rgb(var(--primary-100))",
        "primary-200": "rgb(var(--primary-200))",
        "primary-300": "rgb(var(--primary-300))",
        "primary-400": "rgb(var(--primary-400))",
        "primary-500": "rgb(var(--primary-500))",
        "primary-600": "rgb(var(--primary-600))",
        "primary-700": "rgb(var(--primary-700))",
        "primary-800": "rgb(var(--primary-800))",
        "primary-900": "rgb(var(--primary-900))",
        "primary-950": "rgb(var(--primary-950))",
        "surface-0": "rgb(var(--surface-0))",
        "surface-50": "rgb(var(--surface-50))",
        "surface-100": "rgb(var(--surface-100))",
        "surface-200": "rgb(var(--surface-200))",
        "surface-300": "rgb(var(--surface-300))",
        "surface-400": "rgb(var(--surface-400))",
        "surface-500": "rgb(var(--surface-500))",
        "surface-600": "rgb(var(--surface-600))",
        "surface-700": "rgb(var(--surface-700))",
        "surface-800": "rgb(var(--surface-800))",
        "surface-900": "rgb(var(--surface-900))",
        "surface-950": "rgb(var(--surface-950))",
      },
      width: {
        90: "360px",
        "500px": "500px",
        "700px": "700px",
      },
      height: {
        0.75: "3px",
        62: "248px",
        500: "500px",
      },
      fontSize: {
        md: "15px",
        17: "17px",
        13: "13px",
        15: "15px",
        11: "11px",
        12: "12px",
      },
      maxWidth: {
        "news-width": "680px",
        "register-form": "432px",
      },
      lineHeight: {
        18: "18px",
        15: "15px",
        13: "13px",
      },
      scale: {
        120: "1.2",
      },
      spacing: {
        85: "85%",
      },
      boxShadow: {
        "custom-sm": "0 5px 15px 0px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
