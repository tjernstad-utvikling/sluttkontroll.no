import { AppRouter } from './router';
import { AuthProvider } from './hooks/useAuth';
import { ConfirmationDialogProvider } from './hooks/useConfirm';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core/styles';
import { UserContextProvider } from './data/user';
import { theme } from './theme/light';

function App() {
    return (
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
    );
}

export default App;
