import { AppRouter } from './router';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from '@material-ui/core/styles';
import { UserContextProvider } from './data/user';
import { theme } from './theme/light';
function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <UserContextProvider>
                    <AppRouter />
                </UserContextProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
