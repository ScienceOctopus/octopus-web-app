import { createGlobalStyle } from "styled-components";

// TODO: generate secondary colors from the main ones in js
const GlobalStyle = createGlobalStyle`
  :root {
    --octopus-theme-accent: #a092ed;
    --octopus-theme-background: #abbef0;

    --octopus-theme-publication: hsl(270, 68%, 60%);
    --octopus-theme-publication-highlight: hsl(270, 68%, 85%);
    --octopus-theme-publication-highlight-transparent: hsla(270, 68%, 85%, 0);

    --octopus-theme-review: hsl(176, 56%, 50%);
    --octopus-theme-review-highlight: hsl(176, 56%, 85%);
    --octopus-theme-review-highlight-transparent: hsla(176, 56%, 85%, 0);

    --octopus-theme-draft: hsl(176, 56%, 50%);
    --octopus-theme-draft-highlight: hsl(176, 56%, 85%);
    --octopus-theme-draft-highlight-transparent: hsla(176, 56%, 85%, 0);

    --octopus-theme-explore: #c4e2dd;
    --octopus-theme-publish: #99a4c7;
    --octopus-theme-moar: #9085b9;
    --octopus-theme-questionable: #9873ab;
  }
`;

export default GlobalStyle;
