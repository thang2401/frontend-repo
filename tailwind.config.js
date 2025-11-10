/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html", // thêm index.html nếu cần
  ],

  theme: {
    extend: {
      fontFamily: {
        playwrite: ['"Playwrite DK Loopet"', "cursive"],
        pacifico: ["Pacifico", "cursive"],
      },
    },
  },
  plugins: [],
};
