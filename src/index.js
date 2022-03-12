import { ColorModeScript } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./utils/theme/theme";

ReactDOM.render(
  <React.StrictMode>
    {console.log(theme.config.initialColorMode)}
    <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
