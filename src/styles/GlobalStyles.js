import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #1b3728; // Dark green color from logo
    --secondary-color: #e6f0ed; // Light mint green background
    --light-pink: #ffe6e6; // Light pink background
    --text-color: #333;
    --light-gray: #eee;
    --white: #fff;
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
    color: var(--text-color);
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