import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
   :root {
    // Primary Color Palette
    --color-primary-500: #043F35;      // Main primary color
    --color-primary-400: #0A5C4D;      // Slightly lighter
    --color-primary-300: #107A66;      // Medium light
    --color-primary-200: #86CE96;      // Your lite-green (now as primary-200)
    --color-primary-100: #E6F0ED;      // Very light (your light-mint)

    // Secondary Color Palette
    --color-secondary-500: #AE8119;    // Main secondary (your secondary)
    --color-secondary-400: #C5941C;    // Slightly lighter
    --color-secondary-300: #DBA71F;     // Medium light
    --color-secondary-200: #F2BA22;     // Light
    --color-secondary-100: #F8DCA6;     // Very light

    // Status Colors
    --color-success-500: #2F855A;      // Success
    --color-success-100: #C6F6D5;      // Light success
    
    --color-warning-500: #EAB308;      // Warning
    --color-warning-100: #FEFCBF;      // Light warning
    
    --color-error-500: #FF3B30;        // Error
    --color-error-100: #FED7D7;        // Light error
    
    --color-info-500: #6585FE;         // Info
    --color-info-100: #BEE3F8;         // Light info

    // Neutral Colors
    --color-neutral-900: #000000;      // Black 
    --color-neutral-800: #333333;      // Dark gray 
    --color-neutral-700: #616161;      // Medium gray
    --color-neutral-500: #CCCCCC;      // Border color
    --color-neutral-300: #EEEEEE;      // Light gray
    --color-neutral-200: #FEFFFE;      // Light gray
    --color-neutral-100: #F7F7F7;      // Background color
    --color-neutral-000: #FFFFFF;      // White

    // Background colors
    --color-background-primary: var(--color-primary-500)
    --color-background-dark: var(--color-neutral-800) // Dark 
    --color-background-light: var(--color-neutral-700) // Light
    --color-background-white: var(--color-neutral-000) // white

    // Accent Colors
    --color-accent-pink: #FFE6E6;      // light-pink
    --color-accent-mint: #E6F0ED;      // Duplicate of primary-100

    // Text Colors
    --color-text-primary: var(--color-primary-500);
    --color-text-secondary: var(--color-neutral-200);
    --color-text-dark: var(--color-neutral-800);
    --color-text-lite: var(--color-neutral-700);
    --color-text-black: var(--color-neutral-900);        // Black
    --color-text-white: var(--color-neutral-000);        // White

    // Border Colors
    --color-border-primary: var(--color-primary-500);
    --color-border-secondary: var(--color-neutral-500);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  #root {
    min-height: 100vh;
  }

  body {
    font-family: 'Manrope', 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--color-text-primary);
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, button {
    font-family: inherit;
  }
`;

export default GlobalStyles; 