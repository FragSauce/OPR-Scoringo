/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Two player accent colors
        player1: {
          DEFAULT: "#2563eb", // blue-600
          soft: "#1e3a5f",
        },
        player2: {
          DEFAULT: "#dc2626", // red-600
          soft: "#5f1e1e",
        },
      },
    },
  },
  plugins: [],
};
