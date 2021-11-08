import './index.css';

import { AppRouter } from './router';
import { AuthProvider } from './hooks/useAuth';
import { CacheProvider } from '@emotion/react';
import { ConfirmationDialogProvider } from './hooks/useConfirm';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import { UserContextProvider } from './data/user';
import createCache from '@emotion/cache';
import { theme } from './theme/light';

export const muiCache = createCache({
    key: 'mui',
    prepend: true
});

function App() {
    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
                <ConfirmationDialogProvider>
                    <SnackbarProvider
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                        maxSnack={3}>
                        <UserContextProvider>
                            <AuthProvider>
                                <AppRouter />
                            </AuthProvider>
                        </UserContextProvider>
                    </SnackbarProvider>
                </ConfirmationDialogProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;
