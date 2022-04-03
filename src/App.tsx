import './index.css';

import { QueryClient, QueryClientProvider } from 'react-query';

import { AppRouter } from './router';
import { AuthProvider } from './hooks/useAuth';
import { CacheProvider } from '@emotion/react';
import { ConfirmationDialogProvider } from './hooks/useConfirm';
import { ReactQueryDevtools } from 'react-query/devtools';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import { UserContextProvider } from './data/user';
import createCache from '@emotion/cache';
import { theme } from './theme/light';

export const muiCache = createCache({
    key: 'mui',
    prepend: true
});

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // ✅ globally default to 60 seconds
            staleTime: 1000 * 60
        }
    }
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
                        <QueryClientProvider client={queryClient}>
                            <UserContextProvider>
                                <AuthProvider>
                                    <AppRouter />
                                </AuthProvider>
                            </UserContextProvider>
                            <ReactQueryDevtools initialIsOpen={false} />
                        </QueryClientProvider>
                    </SnackbarProvider>
                </ConfirmationDialogProvider>
            </ThemeProvider>
        </CacheProvider>
    );
}

export default App;
