/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}", // ¡Esta es la línea clave para tu estructura!
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Aquí podrías añadir tus colores personalizados más adelante
    },
  },
  plugins: [],
}