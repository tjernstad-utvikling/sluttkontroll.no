import {
  Palette,
  PaletteOptions,
} from "@material-ui/core/styles/createPalette";

import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1A4D27",
    },
    secondary: {
      main: "#F5F5F5",
    },
  },
});

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    palette: Palette;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    palette?: PaletteOptions;
  }
}
