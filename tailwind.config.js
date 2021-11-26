module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      opacityblack:'rgba(0, 0, 0, 0.7)',
      lowblack:'#353738',
      black: "#111419",
      white: "#FFFFFF",
      orange: "#FA7D09",
      navy: "#395185",
      red: "#FF0000",
      green: "#228B22",
      "low-gray": "#E5E5E5",
      "mid-gray": "#9A9A9A",
      "high-gray": "#444",
      transparent: "transparent",
      "black-50": "#000000aa",
    },
    boxShadow: {
      top: "0 12px 20px #000",
    },
    minHeight: {
      "footer-icon": "21.6px",
      screen: "100vh",
    },
    screens: {
      "xsm": "400px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
    },
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      visibility: [
        "group-hover",
        "group-focus",
        "focus",
        "hover",
        "responsive",
        "focus-within",
        "active",
      ],
      flexGrow: ['last'],
      margin: ['last'],
    },
  },
  plugins: [],
};
