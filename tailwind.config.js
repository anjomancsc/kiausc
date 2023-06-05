/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
