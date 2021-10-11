import { Palette, PaletteOptions } from '@mui/material/styles';

import { unstable_createMuiStrictModeTheme as createMuiTheme, adaptV4Theme } from '@mui/material';

export const theme = createMuiTheme(adaptV4Theme({
    palette: {
        primary: {
            main: '#1A4D27',
            dark: '#0D2613 '
        },
        secondary: {
            main: '#F5F5F5'
        }
    }
}));

declare module '@mui/material/styles/createMuiTheme' {
    interface Theme {
        palette: Palette;
    }

    // allow configuration using `createMuiTheme`
    interface DeprecatedThemeOptions {
        palette?: PaletteOptions;
    }
}
