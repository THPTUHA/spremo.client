module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '468px',

      'semi-xs': '540px',

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }
      'semi-md': '960px',


      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }
      'semi-lg': '1200px',

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        primary: {
          light: '#f2e1e2',
          normal: '#e8bec0',
          DEFAULT: '#e02329',
          dark: '#ed5e21'
         
        }
      }
    }
  },
  variants: {
    extend: {
       textColor: ['nextOnChecked'],
       backgroundColor: ['nextOnChecked'],
       borderColor: ['nextOnChecked']
    },
  },
  // plugins: [
  //   require('@tailwindcss/line-clamp'),
  //   require('tailwind-scrollbar'),
  //   require('./tailwind/clip-path.tailwind'),
  //   require('./tailwind/height.tailwind'),
  //   require('./tailwind/z-index.tailwind'),
  //   require('./tailwind/complex-variants.tailwind')
  // ],
}

