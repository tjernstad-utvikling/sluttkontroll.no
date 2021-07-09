import { AppRouter } from './router';
import { AuthProvider } from './hooks/useAuth';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core/styles';
import { UserContextProvider } from './data/user';
import { theme } from './theme/light';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <UserContextProvider>
                    <SnackbarProvider
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                        maxSnack={3}>
                        <AppRouter />
                    </SnackbarProvider>
                </UserContextProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
