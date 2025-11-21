/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#D42F24',   // Nepal flag red
        accent: '#003087',    // Nepal flag blue
      }
    },
  },
  plugins: [],
}