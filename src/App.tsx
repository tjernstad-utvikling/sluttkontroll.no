import { AppRouter } from "./router";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./theme/light";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
