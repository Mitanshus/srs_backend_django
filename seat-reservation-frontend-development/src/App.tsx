import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme";
import AppRouter from "./navigation/Route";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppRouter />
        <ToastContainer />
      </ThemeProvider>
    </>
  );
}

export default App;
