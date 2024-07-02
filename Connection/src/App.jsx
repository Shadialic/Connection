import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import UserRoutes from "./routes/Routes";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3f51b5",
      },
      secondary: {
        main: "#f50057",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
