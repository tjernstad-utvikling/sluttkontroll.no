import { AppRouter } from './router';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme/light';
function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
