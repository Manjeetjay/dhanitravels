/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          sand: "#F8F2E7",
          ivory: "#FFF9F0",
          charcoal: "#1E2022",
          slate: "#2A2D31",
          clay: "#A6491D",
          teal: "#0D606D",
          citrus: "#EAA828",
          gold: "#D4A836",
          amber: "#F5B041"
        }
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Manrope", "sans-serif"]
      },
      backgroundImage: {
        radial:
          "radial-gradient(circle at 10% 20%, rgba(234,168,40,0.18), transparent 40%), radial-gradient(circle at 90% 0%, rgba(13,96,109,0.12), transparent 35%)",
        "hero-gradient":
          "linear-gradient(135deg, rgba(30,32,34,0.95) 0%, rgba(30,32,34,0.6) 40%, rgba(30,32,34,0.3) 70%, transparent 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #EAA828 0%, #D4A836 50%, #F5B041 100%)",
        "dark-gradient":
          "linear-gradient(180deg, rgba(30,32,34,0) 0%, rgba(30,32,34,0.85) 100%)"
      },
      boxShadow: {
        panel: "0 20px 45px rgba(30, 32, 34, 0.12)",
        glow: "0 0 30px rgba(234,168,40,0.15)",
        "card-hover": "0 25px 60px rgba(30, 32, 34, 0.18)",
        soft: "0 4px 20px rgba(30, 32, 34, 0.06)"
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "slide-up-fade": "slideUpFade 0.5s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
        "pulse-slow": "pulse 3s ease-in-out infinite"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        slideUpFade: {
          "0%": { transform: "translateY(15px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" }
        }
      }
    }
  },
  plugins: []
};
