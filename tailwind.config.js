/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "modal-pop": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "50%": { transform: "scale(1.05)", opacity: "0.5" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "modal-pop": "modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      boxShadow: {
        modal: "0 0 50px -12px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
