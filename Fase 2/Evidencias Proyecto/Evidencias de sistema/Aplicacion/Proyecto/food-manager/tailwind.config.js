/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/views/**/*.ejs",
    "./src/static/js/**/*.js"  // si tienes JavaScript que genera clases
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}