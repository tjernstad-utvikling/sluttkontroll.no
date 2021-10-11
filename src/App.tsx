import { AppRouter } from './router';
import { AuthProvider } from './hooks/useAuth';
import { ConfirmationDialogProvider } from './hooks/useConfirm';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material/styles';
import { UserContextProvider } from './data/user';
import { theme } from './theme/light';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


function App() {
    return (
        <StyledEngineProvider injectFirst>
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
        </StyledEngineProvider>
    );
}

export default App;
