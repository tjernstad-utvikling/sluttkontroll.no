import { MainLayout } from "./layout/main";
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./theme/light";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MainLayout>
        <p>Text</p>
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
