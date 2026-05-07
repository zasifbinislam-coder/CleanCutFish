/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deep:   "#0D5C5E",   // Deep teal — riverfish.com.bd vibe
          ocean:  "#0E6F70",
          teal:   "#15918F",   // Primary accent teal
          mint:   "#3FB7A5",
          sand:   "#F6F1E7",   // Warm off-white
          cream:  "#FFFBF2",
        },
        accent: {
          coral:  "#E97B2B",   // Warm orange — main CTA accent
          gold:   "#E9B44C",
          deep:   "#B95A1A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(11, 61, 92, 0.18)",
        card: "0 2px 12px -2px rgba(11, 61, 92, 0.10)",
      },
      backgroundImage: {
        "wave-pattern":
          "radial-gradient(circle at 20% 0%, rgba(15,139,141,0.10), transparent 40%), radial-gradient(circle at 90% 30%, rgba(11,61,92,0.08), transparent 50%)",
      },
    },
  },
  plugins: [],
};
