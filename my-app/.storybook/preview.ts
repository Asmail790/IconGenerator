import type { Preview } from "@storybook/react";
import "../src/app/globals.css"
import { withThemeByClassName } from "@storybook/addon-themes";
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;


/* snipped for brevity */

export const decorators =[withThemeByClassName({
    themes: {
        // nameOfTheme: 'classNameForTheme',
        light: '',
        dark: 'dark',
    },
    defaultTheme: 'dark',
})];