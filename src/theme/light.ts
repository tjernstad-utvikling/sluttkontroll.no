import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1A4D27',
            dark: '#0d2613'
        },
        secondary: {
            main: '#F5F5F5'
        },
        error: {
            main: '#ca3c25'
        },
        success: {
            main: '#8fc93a'
        },
        info: {
            main: '#235789'
        },
        background: {
            default: '#F5F5F5'
        },
        warning: {
            main: '#F3A712'
        },
        text: {
            disabled: '#737373'
        }
    }
});
