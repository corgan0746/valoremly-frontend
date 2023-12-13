/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens:{
        'sm': '300px',
        'md': '600px',
        'lg': '1000px',
        'xl': '1400px',
        '2xl': '1800px',
        '3xl' : '2100px',
      },
      keyframes:{
        iconHover:{
          '0%': {transform: 'scale(1)'},
          '50%': {transform: 'scale(1.2)'},
          '100%': {transform: 'scale(1)'},
        },
        appear:{
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},

        },
        slideIn:{
          '0%': {left: '-80%', display: 'none'},
          '50%': {display: 'none'},
          '100%': {left: '0%', display: 'block'},
        },
        slideOut:{
          '0%': {left: '0%'},
          '100%': {left: '-80%', display: 'none'},

      },
        vanish:{
          '0%': {opacity: '1', display: 'block'},
          '90%': {opacity: '1' ,display: 'block'},
          '100%': {opacity: '0', display: 'none'},

    }},
      animation:{
        vanish: 'vanish 1s ease-in forwards',
        slideIn: 'slideIn 0.6s ease-in-out forwards',
        slideOut: 'slideOut 0.6s ease-in-out forwards',
        iconHover: 'iconHover 1s ease-in-out infinite',
        appear: 'appear 0.5s ease-in-out',
      },
      }
    },
  
  plugins: [],
  extend: {
    backgroundImage: {
      'MainLogo': "url('./src/assets/images/valoremli-logo.png')",
    }
  }
}
