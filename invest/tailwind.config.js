/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Здесь вы добавляете свои кастомные стили
      colors: {
        "awesome-blue": "#007ACE", // Ваш собственный цвет
        primary: "#BADA55", // Переопределение существующего цвета (если нужно)
      },
      spacing: {
        128: "32rem", // Кастомный отступ
      },
    },
  },
  plugins: [],
};
