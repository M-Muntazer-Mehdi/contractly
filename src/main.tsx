/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css"
import { Provider } from "react-redux";
import { store } from "./store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NBaF1cWGhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFjXH1acHBVTmBYVkRxXg=="
);
import 'react-quill/dist/quill.snow.css';
const theme = createTheme({
  typography: {
    fontFamily: ["Nunito Sans", "sans-serif"].join(","),
    subtitle1: {
      fontSize: "20px",
    },
    subtitle2: {
      fontSize: "17px",
    },
    body2: {
      fontSize: "12px",
    },
    body1: {
      fontSize: "16px",
      // fontWeight: 400,
    },
  },
  palette: {
    text: {
      secondary: " #555,", // Replace this with your desired color value
    },
    background: {
      default: "#f4f6f8", // Your preferred background color
    },
  },
  // shadows: [
  //   "none",
  //   "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)", // redefine the elevation 1 shadow
  //   // ... redefine other elevations if needed
  // ],
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#b1f8fe",
          color: "black",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        border: "1px solid red",
        columnHeader: {
          // fontWeight: "900",

          fontSize: "17px",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          "&:before": {
            // default underline color
            borderBottom: "1px solid #174B8B",
          },
          "&:after": {
            // underline color when focused
            borderBottom: "2px solid #174B8B",
          },
          "&:hover:not(.Mui-disabled):before": {
            // underline color on hover
            borderBottom: "1px solid #174B8B",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F8FAFD",
          // wordSpacing: "3px",
          // letterSpacing: "0.5px",
        },
      },
    },
    // MuiButton: {
    //   styleOverrides: {
    //     // Name of the variant
    //     outlined: {
    //       color: "#174B8B",
    //       borderColor: "#174B8B", // Change this to your preferred color
    //       "&:hover": {
    //         borderColor: "#1171D1", // Optional: Change for hover state
    //       },
    //     },
    //   },

    // },
  },
  // Other theme configurations
} as any);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
  // </React.StrictMode>
);
