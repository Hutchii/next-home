/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "blue-500": "#2079ff",
      white: "#ffffff",
      "red-500": "#ff2070",
      "blue-800": "#001330",
      "blue-300": "#b2d1ff",
      "blue-100": "#eaf2ff",
      "grey-500": "#647288",
      "grey-400": "#96a1b2",
    },
    fontFamily: {
      sans: ["Outfit"],
    },
    fontSize: {
      base: "1rem",
      xs: "1.125rem",
      sm: "1.5rem",
      md: "2rem",
      lg: "2.625rem",
      xl: "3.5rem",
      "2xl": "4.75rem",
      "3xl": "6.25rem",
    },
    boxShadow: {
      big: "0px 20px 25px -5px rgba(0,0,0,0.06)",
      small: "0px 10px 15px -3px rgba(0,0,0,0.06)",
      test: "0px 10px 15px -3px rgba(0,0,0,0.5)",
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1600px",
      "4xl": "1920px",
      "5xl": "2048px",
    },
    extend: {
      // transitionTimingFunction: {
      //   bezier: "cubic-bezier(.42,.97,.52,1)",
      // },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [],
};
