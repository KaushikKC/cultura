/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        gloock: ["Gloock", "serif"]
      },

      animation: {
        fadeInScale: "fadeInScale 0.6s ease-out forwards",
        fadeInText: "fadeInText 0.6s ease-out 0.3s forwards",
        glitch: "glitch 0.3s infinite",
        "focus-pulse":
          "focus-pulse 4s cubic-bezier(0.25, 0.8, 0.25, 1) infinite",
        "type-gradient": "type-gradient 2s linear infinite"
      },
      keyframes: {
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        fadeInText: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
