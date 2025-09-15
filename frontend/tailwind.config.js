/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: { brand: { 500: "#2e86ff" }, ink: "#0f172a", soft: "#64748b" },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: { card: "0 10px 30px rgba(0,0,0,0.08)" },
    },
  },
  plugins: [],
}
