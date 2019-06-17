import { createGlobalStyle } from "styled-components";

// TODO: generate secondary colors from the main ones in js
const GlobalStyle = createGlobalStyle`
  :root {
    --octopus-theme-accent: hsl(249, 72%, 75%);
    --octopus-theme-accent-dark: hsl(249, 72%, 65%);
    
    --octopus-theme-background: hsl(223, 70%, 80%);

    --octopus-theme-problem: hsl(249, 72%, 75%);
    
    --octopus-theme-publication: hsl(270, 68%, 60%);
    --octopus-theme-publication-highlight: hsl(270, 68%, 85%);
    --octopus-theme-publication-highlight-transparent: hsla(270, 68%, 85%, 0);

    --octopus-theme-review: hsl(176, 56%, 50%);
    --octopus-theme-review-highlight: hsl(176, 56%, 85%);
    --octopus-theme-review-highlight-transparent: hsla(176, 56%, 85%, 0);

    --octopus-theme-draft: hsl(176, 56%, 50%);
    --octopus-theme-draft-highlight: hsl(176, 56%, 85%);
    --octopus-theme-draft-highlight-transparent: hsla(176, 56%, 85%, 0);

    --octopus-theme-explore: hsl(170, 34%, 85%);
    --octopus-theme-publish: hsl(226, 29%, 70%);
    --octopus-theme-moar: hsl(253, 27%, 60%);
    --octopus-theme-questionable: hsl(280, 25%, 55%);
  }
`;

export default GlobalStyle;
