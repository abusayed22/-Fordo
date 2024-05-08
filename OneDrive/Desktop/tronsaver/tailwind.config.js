/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      boxShadow: {
        primary: " 0px 0px 20px 1px rgba(255, 0,0)",
        secondary: " 0 0 30px 5px rgba(255, 255, 255, 1)",
      },
      colors: {
        primary: "#B20000",
        secondary: "#F2F2EF",
        basic: "#AEC09A",
        green: "#344C11",
        red: "#FD292F"
      },

},
    screens: {
      xx_sm:"320px",
      x_sm: "480px",
      sm:"600px",
      md: "640px",
      lg: "1024px",
      xl:"1280px",
      x_xl: "1536px"
    }
  },
  plugins: [],
};
