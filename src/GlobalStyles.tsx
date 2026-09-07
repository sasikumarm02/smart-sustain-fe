import { createGlobalStyle, css, styled } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Exo:wght@100..900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap')

  body {
    margin: 0;
    padding: 0;
    font-family: 'Rubik', sans-serif;
    background: linear-gradient(to bottom right, rgba(99, 235, 218, 0.1) 0%, rgba(255, 163, 218, 0.1) 27%, rgba(180, 151, 255, 0.1) 66%, rgba(172, 234, 255, 0.1) 100%);
  }
  h1,h2,h3,h4,h5,h6 {
    font-family: 'Arial', sans-serif;
    color:#00338D;
  }
`;
