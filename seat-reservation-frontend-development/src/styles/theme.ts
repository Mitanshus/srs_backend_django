//Import Statements
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  //you can set color
  palette: {
    primary: {
      main: "#008037", // Setting the main primary color
    },
    secondary: {
      main: "#848884", // Setting the main secondary color to the custom color
    },
  },
  typography: {
    fontFamily: [
      "Poppins", //Setting font-family
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiTextField: {
      defaultProps: {
        inputProps: {
          style: {
            fontSize: "14px",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
        },
      },
    },
  },
});

export default theme;
