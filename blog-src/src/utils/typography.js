import Typography from 'typography';
import theme from 'typography-theme-us-web-design-standards';

let typography;

// Replace the first font in the font-stack for the header
theme.headerFontFamily[0] = 'Source Sans Pro';
theme.baseFontSize = '18px';

typography = new Typography(theme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export const rhythm = typography.rhythm;
export const scale = typography.scale;

export default typography;
