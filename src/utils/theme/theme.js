import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "320px",
  md: "768px",
  lg: "1100px",
  xl: "1300px",
  "2xl": "1600px",
});

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ breakpoints, config });

export default theme;
