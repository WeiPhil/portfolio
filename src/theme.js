import { grey } from "@mui/material/colors";
import { red } from "@mui/material/colors";
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#BF360C",
    },
    secondary: {
      main: "#585858",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#f1f1f1",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: grey[800],
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        }
      }
    }
  }
});

export default theme;
