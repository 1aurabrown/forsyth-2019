
const spacing = {
  // Theme-specific spacing
  // Add here
  'announcement': 'var(--announcement-bar-height)',
  'header': 'var(--header-height)',
  'inset': '0.625rem',
  'inset-2': '1.25rem',
  'inset-3': '1.875rem',
  'inset-4': '2.5rem',
  'inset-5': '3.125rem',
  'inset-6': '3.75rem',
  'inset-7': '4.375rem',
  'inset-8': '5rem',
  'inset-12': '7.5rem',
  'thin': '.125rem',
  'gutter-mobile': '10px',
  'gutter-desktop': '30px',
  'v-space': '0.875';
  'text-line': '1rem',
   // fractions
  '1/2': 100.0 * 1/2 + '%',
  '1/3': 100.0 * 1/3 + '%',
  '2/3': 100.0 * 2/3 + '%',
  '1/4': 100.0 * 1/4 + '%',
  '2/4': 100.0 * 2/4 + '%',
  '3/4': 100.0 * 3/4 + '%',
  '1/6': 100.0 * 1/6 + '%',
  '2/6': 100.0 * 2/6 + '%',
  '3/6': 100.0 * 3/6 + '%',
  '4/6': 100.0 * 4/6 + '%',
  '5/6': 100.0 * 5/6 + '%',
  '1/8': 100.0 * 1/8 + '%',
  '2/8': 100.0 * 2/8 + '%',
  '3/8': 100.0 * 3/8 + '%',
  '4/8': 100.0 * 4/8 + '%',
  '5/8': 100.0 * 5/8 + '%',
  '6/8': 100.0 * 6/8 + '%',
  '7/8': 100.0 * 7/8 + '%',
  // percents
  '0-per': '0%',
  '5-per': '5%',
  '10-per': '10%',
  '15-per': '15%',
  '20-per': '20%',
  '25-per': '25%',
  '30-per': '30%',
  '35-per': '35%',
  '40-per': '40%',
  '45-per': '45%',
  '50-per': '50%',
  '55-per': '55%',
  '60-per': '60%',
  '65-per': '65%',
  '70-per': '70%',
  '75-per': '75%',
  '80-per': '80%',
  '85-per': '85%',
  '90-per': '90%',
  '95-per': '95%',
};

for (let i = 0; i < 101; i++) {
  spacing[i] = `${i/4.000}rem`
}


module.exports = {
  content: [
    './assets/*.{js, css, svg}',
    './**/*.liquid'
  ],
  plugins: [],
  theme: {
    colors: {
      'transparent': 'transparent',
      'white': '#FFFFFF',
      'black': '#000000',
      'current': 'currentColor',
      // Background colors
      'body-text': 'var(--color-body-text)',
      'body': 'var(--color-main-background)',
      'accent': 'var(--color-accent)',

    },
    fontSize: {
      base: '0.875rem',
      small: ['0.625rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
    },
    fontFamily: {
      body: ['adobe-garamond-pro', 'serif'],
      heading: ['SansGuiltMBMedium', 'sans-serif']
    },
    letterSpacing: {
      wide: '0.05em',
      normal: '0.02em',
    },
    lineHeight: {
      base: '1em',
      menu: '1.8333'
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '992px',
      'xl': '1300px',
      '2xl': '1536px',
    },
    extend: {
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      screens: {
        'hoverable': { 'raw': '(hover: hover)' }
      },
      spacing: spacing,
      minHeight: spacing,
      maxHeight: spacing,
      minWidth: spacing,
      maxWidth: spacing,
    }
  },
}

