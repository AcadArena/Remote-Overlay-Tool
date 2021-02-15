import React from "react";
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";

const Theme: React.FC = ({ children }) => {
  const theme = responsiveFontSizes(
    createMuiTheme({
      palette: {
        warning: {
          main: "#d13639",
        },
        type: "dark",
        primary: {
          main: "#004fff  ",
        },
        secondary: {
          main: "#FFD303",
        },
      },
    })
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
