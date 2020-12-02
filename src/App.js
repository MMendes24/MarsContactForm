import Form from "./components/Form"

//for general styling across the app
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

let theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto"
  },
});

theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Form />
    </ThemeProvider>
  );
}

export default App;
