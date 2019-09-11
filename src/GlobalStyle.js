import { createGlobalStyle } from "styled-components";

class hsla {
  constructor(h, s, l, a) {
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a !== undefined ? a : 1;
  }

  withLightness(l) {
    return new hsla(this.h, this.s, l, this.a);
  }

  withAlpha(a) {
    return new hsla(this.h, this.s, this.l, a);
  }

  toString() {
    return `hsla(${this.h}, ${Math.round(this.s * 100)}%, ${Math.round(
      this.l * 100,
    )}%, ${this.a})`;
  }
}

const ColourScheme = (() => {
  let scheme = {};

  scheme.accent = new hsla(167, 0.51, 0.38);
  scheme.accentDark = scheme.accent.withLightness(0.65);

  scheme.background = new hsla(167, 0.7, 0.8);

  scheme.problem = new hsla(0, 0, 0);

  scheme.publication = new hsla(167, 0.51, 0.38);
  scheme.publicationHighlight = scheme.publication.withLightness(0.85);
  scheme.publicationHighlightTransparent = scheme.publicationHighlight.withAlpha(0);

  scheme.review = new hsla(176, 0.56, 0.5);
  scheme.reviewHighlight = scheme.review.withLightness(0.85);
  scheme.reviewHighlightTransparent = scheme.reviewHighlight.withAlpha(0);

  scheme.draft = new hsla(176, 0.56, 0.5);
  scheme.draftHighlight = scheme.draft.withLightness(0.85);
  scheme.draftHighlightTransparent = scheme.draftHighlight.withAlpha(0);

  scheme.explore = new hsla(170, 0.34, 0.85);
  scheme.publish = new hsla(170, 0.29, 0.7);
  scheme.moar = new hsla(170, 0.27, 0.6);
  scheme.questionable = new hsla(170, 0.25, 0.55);

  return scheme;
})();

const GlobalStyle = createGlobalStyle`
  :root {
    ${Object.keys(ColourScheme).reduce((acc, key) => {
      return (
        acc +
        ("--octopus-theme-" +
          key
            .replace(/(?:^|\.?)([A-Z])/g, function(x, y) {
              return "-" + y.toLowerCase();
            })
            .replace(/^-/, "") +
          ": " +
          ColourScheme[key] +
          ";")
      );
    }, "")}
  }

  .ui.form input[type=text]:focus {
      border-color: var(--octopus-theme-accent)!important;
  }
`;

export { ColourScheme };

export default GlobalStyle;
